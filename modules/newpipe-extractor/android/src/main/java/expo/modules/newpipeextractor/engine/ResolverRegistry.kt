package expo.modules.newpipeextractor.engine

/**
 * Keeps source selection out of playback code. Resolver order is explicit:
 * primary adapters first, fallback adapters afterwards.
 */
class ResolverRegistry(
    private val resolvers: List<MediaResolver>,
) {
    fun candidates(input: String): List<MediaResolver> =
        resolvers.filter { resolver ->
            runCatching { resolver.supports(input) }.getOrDefault(false)
        }

    fun requireCandidates(input: String): List<MediaResolver> =
        candidates(input).takeIf { it.isNotEmpty() }
            ?: throw ResolveFailure.UnsupportedSource()
}
