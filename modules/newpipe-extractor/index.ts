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
  playbackEngine: string;
};

type NativeNewPipeModule = {
  getLibraryInfo(): NewPipeLibraryInfo;
  getEngineInfo(): RhythmResolverEngineInfo;
  validateCataloguePlaybackUrl(url: string): { valid: boolean; sourceId: string };
  resolveCataloguePlaybackUrl(url: string, mediaId: string): Promise<{ mediaId: string; playbackUrl: string; mimeType: string | null; sourceId: string; expiresAtEpochMs: number | null }>;
};

const nativeModule = () =>
  requireNativeModule<NativeNewPipeModule>("NewPipeExtractor");

/** Returns upstream library metadata; it does not resolve media. */
export function getNewPipeLibraryInfo(): NewPipeLibraryInfo {
  return nativeModule().getLibraryInfo();
}

/** Reports native resolver-core capabilities. */
export function getRhythmResolverEngineInfo(): RhythmResolverEngineInfo {
  return nativeModule().getEngineInfo();
}

/** Resolves an authorised catalogue URL through the native Kotlin coordinator. */
export function resolveCataloguePlaybackUrl(url: string, mediaId: string) {
  return nativeModule().resolveCataloguePlaybackUrl(url, mediaId);
}

/** Validates HTTPS playback URLs from RHYTHM E's authorised open catalogues. */
export function validateCataloguePlaybackUrl(url: string) {
  return nativeModule().validateCataloguePlaybackUrl(url);
}
