package expo.modules.newpipeextractor

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.schabi.newpipe.extractor.NewPipe

/** Read-only metadata bridge. No network requests or media stream resolution. */
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
  }
}
