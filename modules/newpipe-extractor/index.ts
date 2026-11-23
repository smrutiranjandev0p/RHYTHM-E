import { requireNativeModule } from "expo-modules-core";
export type NewPipeServiceMetadata = { id: number; name: string; capabilities: string[] };
export type NewPipeLibraryInfo = {
  version: string;
  license: "GPL-3.0-or-later";
  services: NewPipeServiceMetadata[];
  networkExtractionEnabled: false;
};
type NativeNewPipeModule = { getLibraryInfo(): NewPipeLibraryInfo; };
/** Read-only native library metadata; does not fetch or resolve media streams. */
export function getNewPipeLibraryInfo(): NewPipeLibraryInfo {
  return requireNativeModule<NativeNewPipeModule>("NewPipeExtractor").getLibraryInfo();
}
