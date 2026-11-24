import { requireNativeModule } from "expo-modules-core";

export type NewPipeServiceMetadata = {
  id: number;
  name: string;
  capabilities: string[];
};

export type NewPipeLibraryInfo = {
  version: string;
  license: "GPL-3.0-or-later";
  services: NewPipeServiceMetadata[];
  networkExtractionEnabled: false;
};

export type RhythmResolverEngineInfo = {
  engineLanguage: "Kotlin";
  architecture: string;
  requestDeduplication: boolean;
  memoryCache: boolean;
  prefetchCancellation: boolean;
  providerAdaptersConfigured: boolean;
  youtubeResolutionEnabled: boolean;
};

type NativeNewPipeModule = {
  getLibraryInfo(): NewPipeLibraryInfo;
  getEngineInfo(): RhythmResolverEngineInfo;
};

/** Returns upstream library metadata; it does not resolve media. */
export function getNewPipeLibraryInfo(): NewPipeLibraryInfo {
  return requireNativeModule<NativeNewPipeModule>("NewPipeExtractor").getLibraryInfo();
}

/** Reports native resolver-core capabilities; no provider adapter is enabled yet. */
export function getRhythmResolverEngineInfo(): RhythmResolverEngineInfo {
  return requireNativeModule<NativeNewPipeModule>("NewPipeExtractor").getEngineInfo();
}
