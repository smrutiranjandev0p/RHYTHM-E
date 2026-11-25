package expo.modules.newpipeextractor.engine

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Deferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.async
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap

/**
 * RHYTHM E's resolver orchestration layer.
 *
 * - Shares concurrent requests for the same media identity.
 * - Tries registered adapters in priority order.
 * - Keeps a bounded in-memory cache of short-lived playback URLs.
 * - Cancels speculative prefetch when the user chooses another track.
 *
 * It deliberately does not own the player or modify React Native UI state.
 */
class StreamResolveCoordinator(
    parentScope: CoroutineScope,
    private val registry: ResolverRegistry,
    private val maxCacheEntries: Int = 64,
    private val nowEpochMs: () -> Long = { System.currentTimeMillis() },
) {
    private val scope = CoroutineScope(
        parentScope.coroutineContext + SupervisorJob(parentScope.coroutineContext[Job])
    )
    private val flights = ConcurrentHashMap<String, Deferred<ResolvedMedia>>()
    private val cache = LinkedHashMap<String, ResolvedMedia>()
    private val cacheLock = Any()
    private var prefetchJob: Job? = null
    @Volatile private var activeMediaId: String? = null

    suspend fun resolveForPlayback(input: String, mediaIdentity: String): ResolvedMedia {
        activeMediaId = mediaIdentity
        prefetchJob?.cancel()
        prefetchJob = null
        val result = resolveShared(input, mediaIdentity)
        if (!result.isUsable(nowEpochMs())) {
            invalidate(mediaIdentity)
            throw ResolveFailure.Expired()
        }
        return result
    }

    suspend fun resolveForPrefetch(input: String, mediaIdentity: String): ResolvedMedia {
        val cached = getCached(mediaIdentity)
        if (cached != null) return cached
        return resolveShared(input, mediaIdentity)
    }

    fun prefetchNext(input: String, mediaIdentity: String, onReady: (ResolvedMedia) -> Unit = {}) {
        if (mediaIdentity == activeMediaId) return
        prefetchJob?.cancel()
        prefetchJob = scope.launch(Dispatchers.IO) {
            try {
                val media = resolveForPrefetch(input, mediaIdentity)
                if (media.isUsable(nowEpochMs())) onReady(media)
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (_: Throwable) {
                // Prefetch is speculative. Playback will report the user-visible error.
            }
        }
    }

    fun invalidate(mediaIdentity: String) {
        synchronized(cacheLock) { cache.remove(mediaIdentity) }
    }

    fun clear() {
        prefetchJob?.cancel()
        prefetchJob = null
        flights.values.forEach { it.cancel() }
        flights.clear()
        synchronized(cacheLock) { cache.clear() }
        activeMediaId = null
    }

    fun close() {
        clear()
        scope.cancel()
    }

    private suspend fun resolveShared(input: String, mediaIdentity: String): ResolvedMedia {
        getCached(mediaIdentity)?.let { return it }

        val flight = synchronized(flights) {
            flights[mediaIdentity]?.takeIf { it.isActive } ?: scope.async(Dispatchers.IO) {
                resolveWithFallback(input)
            }.also { created ->
                flights[mediaIdentity] = created
                created.invokeOnCompletion { flights.remove(mediaIdentity, created) }
            }
        }

        val resolved = flight.await()
        if (!resolved.isUsable(nowEpochMs())) throw ResolveFailure.Expired()
        putCached(mediaIdentity, resolved)
        return resolved
    }

    private suspend fun resolveWithFallback(input: String): ResolvedMedia {
        val candidates = registry.requireCandidates(input)
        var lastError: Throwable? = null
        for (resolver in candidates) {
            try {
                val result = resolver.resolve(input)
                if (result.sourceId != resolver.sourceId || !result.isUsable(nowEpochMs())) {
                    throw ResolveFailure.InvalidResult()
                }
                return result
            } catch (cancelled: CancellationException) {
                throw cancelled
            } catch (error: Exception) {
                lastError = error
            }
        }
        throw ResolveFailure.Unavailable(lastError)
    }

    private fun getCached(identity: String): ResolvedMedia? = synchronized(cacheLock) {
        val value = cache[identity] ?: return@synchronized null
        if (!value.isUsable(nowEpochMs())) {
            cache.remove(identity)
            return@synchronized null
        }
        value
    }

    private fun putCached(identity: String, value: ResolvedMedia) {
        synchronized(cacheLock) {
            cache[identity] = value
            while (cache.size > maxCacheEntries) {
                val oldest = cache.keys.firstOrNull() ?: break
                cache.remove(oldest)
            }
        }
    }
}
