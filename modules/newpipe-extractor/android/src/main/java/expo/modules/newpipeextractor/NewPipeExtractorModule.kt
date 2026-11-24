package expo.modules.newpipeextractor

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.schabi.newpipe.extractor.NewPipe
import expo.modules.newpipeextractor.engine.AuthorisedCatalogueResolver

/** Native metadata and authorised-catalogue validation bridge. */
class NewPipeExtractorModule : Module() {
  private val catalogueResolver = AuthorisedCatalogueResolver()

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
        "architecture" to "ResolverRegistry -> StreamResolveCoordinator -> authorised catalogue validation -> Expo Audio handoff",
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
  }
}
