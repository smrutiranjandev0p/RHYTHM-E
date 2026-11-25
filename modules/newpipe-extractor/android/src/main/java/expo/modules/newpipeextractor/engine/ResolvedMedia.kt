package expo.modules.newpipeextractor.engine

/**
 * Normalized result returned by an authorised media provider.
 *
 * Keep provider-specific response objects out of the playback/UI layers.
 * Signed URLs are sensitive and must never be written to logs.
 */
data class ResolvedMedia(
    val mediaId: String,
    val title: String,
    val artist: String?,
    val playbackUrl: String,
    val mimeType: String?,
    val sourceId: String,
    val expiresAtEpochMs: Long?,
    val requestHeaders: Map<String, String> = emptyMap(),
) {
    fun isUsable(nowEpochMs: Long = System.currentTimeMillis()): Boolean =
        playbackUrl.startsWith("https://") &&
            (expiresAtEpochMs == null || expiresAtEpochMs > nowEpochMs)
}

/** A provider adapter resolves only content it is authorised to provide. */
interface MediaResolver {
    val sourceId: String
    fun supports(input: String): Boolean
    suspend fun resolve(input: String): ResolvedMedia
}

/** Typed failures make fallback decisions explicit and observable. */
sealed class ResolveFailure(message: String, cause: Throwable? = null) :
    Exception(message, cause) {
    class UnsupportedSource : ResolveFailure("No authorised resolver supports this source")
    class Unavailable(cause: Throwable? = null) : ResolveFailure("Media is unavailable", cause)
    class InvalidResult : ResolveFailure("Resolver returned an invalid media result")
    class Expired : ResolveFailure("Resolved media URL has expired")
}
