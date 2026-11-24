package expo.modules.newpipeextractor

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.schabi.newpipe.extractor.NewPipe

/** Native metadata and resolver-engine capability bridge. */
class NewPipeExtractorModule : Module() {
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
        "architecture" to "ResolverRegistry -> StreamResolveCoordinator -> Playback handoff",
        "requestDeduplication" to true,
        "memoryCache" to true,
        "prefetchCancellation" to true,
        "providerAdaptersConfigured" to false,
        "youtubeResolutionEnabled" to false
      )
    }
  }
}
