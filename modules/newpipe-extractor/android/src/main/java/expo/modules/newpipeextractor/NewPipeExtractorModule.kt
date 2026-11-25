package expo.modules.newpipeextractor

import expo.modules.kotlin.functions.Coroutine
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import org.schabi.newpipe.extractor.NewPipe
import expo.modules.newpipeextractor.engine.AuthorisedCatalogueResolver
import expo.modules.newpipeextractor.engine.ResolverRegistry
import expo.modules.newpipeextractor.engine.StreamResolveCoordinator

/** Native resolver bridge for RHYTHM E's authorised open-catalogue URLs. */
class NewPipeExtractorModule : Module() {
  private val catalogueResolver = AuthorisedCatalogueResolver()
  private val resolverScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
  private val coordinator = StreamResolveCoordinator(
    parentScope = resolverScope,
    registry = ResolverRegistry(listOf(catalogueResolver)),
  )

  override fun definition() = ModuleDefinition {
    Name("NewPipeExtractor")

    Function("getLibraryInfo") {
      val services = NewPipe.getServices().map { service ->
        mapOf(
          "id" to service.serviceId,
          "name" to service.serviceInfo.name,
          "capabilities" to service.serviceInfo.mediaCapabilities.map { it.name }
        )
      }
      mapOf(
        "version" to "v0.27.1",
        "license" to "GPL-3.0-or-later",
        "services" to services,
        "networkExtractionEnabled" to false
      )
    }

    Function("getEngineInfo") {
      mapOf(
        "engineLanguage" to "Kotlin",
        "architecture" to "ResolverRegistry -> StreamResolveCoordinator -> authorised catalogue adapter -> Expo Audio",
        "requestDeduplication" to true,
        "memoryCache" to true,
        "prefetchCancellation" to true,
        "providerAdaptersConfigured" to true,
        "youtubeResolutionEnabled" to false,
        "playbackEngine" to "existing Expo Audio player"
      )
    }

    Function("validateCataloguePlaybackUrl") { url: String ->
      mapOf(
        "valid" to catalogueResolver.validateHttpsUrl(url),
        "sourceId" to catalogueResolver.sourceId
      )
    }

    AsyncFunction("resolveCataloguePlaybackUrl") Coroutine { url: String, mediaId: String ->
      val resolved = coordinator.resolveForPlayback(url, mediaId)
      mapOf(
        "mediaId" to resolved.mediaId,
        "playbackUrl" to resolved.playbackUrl,
        "mimeType" to resolved.mimeType,
        "sourceId" to resolved.sourceId,
        "expiresAtEpochMs" to resolved.expiresAtEpochMs
      )
    }
  }
}
