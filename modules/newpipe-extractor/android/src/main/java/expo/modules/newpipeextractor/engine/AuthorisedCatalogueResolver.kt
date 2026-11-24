package expo.modules.newpipeextractor.engine

import android.net.Uri

/**
 * Validates direct playback URLs returned by RHYTHM E's existing authorised
 * catalogue adapters. It does not scrape, extract, download, or bypass access
 * controls. The existing Expo Audio player remains responsible for playback.
 */
class AuthorisedCatalogueResolver : MediaResolver {
    override val sourceId: String = "rhythm-e-open-catalogues"

    private val allowedHosts = setOf(
        "api.audius.co",
        "audius.co",
        "archive.org",
        "www.archive.org",
        "upload.wikimedia.org",
        "commons.wikimedia.org",
    )

    override fun supports(input: String): Boolean = validateHttpsUrl(input)

    override suspend fun resolve(input: String): ResolvedMedia {
        if (!supports(input)) throw ResolveFailure.UnsupportedSource()
        val uri = Uri.parse(input)
        return ResolvedMedia(
            mediaId = input,
            title = uri.lastPathSegment ?: "Online audio",
            artist = null,
            playbackUrl = input,
            mimeType = null,
            sourceId = sourceId,
            expiresAtEpochMs = null,
        )
    }

    fun validateHttpsUrl(input: String): Boolean {
        val uri = runCatching { Uri.parse(input) }.getOrNull() ?: return false
        val host = uri.host?.lowercase() ?: return false
        val hostAllowed = host in allowedHosts ||
            host.endsWith(".archive.org") ||
            host.endsWith(".wikimedia.org")
        return uri.scheme.equals("https", ignoreCase = true) &&
            hostAllowed &&
            uri.userInfo == null &&
            (uri.port == -1 || uri.port == 443)
    }
}
