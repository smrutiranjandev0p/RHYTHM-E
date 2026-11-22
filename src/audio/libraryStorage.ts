import {Directory,File,Paths} from "expo-file-system";

const musicDirectory=new Directory(Paths.document,"rhythm-e-library");

const safeName=(value:string)=>value
 .normalize("NFKD")
 .replace(/[^a-zA-Z0-9._-]+/g,"-")
 .replace(/-+/g,"-")
 .replace(/^-|-$/g,"")
 .slice(0,90)||"audio";

export async function copyImportedAudioToLibrary(sourceUri:string,trackId:string,originalName:string):Promise<string>{
 musicDirectory.create({idempotent:true,intermediates:true});
 const source=new File(sourceUri);
 if(!source.exists)throw new Error("The selected audio file is no longer available.");
 const extension=originalName.match(/\.[a-zA-Z0-9]{1,8}$/)?.[0]||"";
 const base=safeName(originalName.replace(/\.[^.]+$/,""));
 const destination=new File(musicDirectory, safeName(trackId)+"-"+base+extension.toLowerCase());
 await source.copy(destination);
 if(!destination.exists)throw new Error("The app could not save this audio file.");
 return destination.uri;
}

export function deleteManagedAudio(uri:string):void{
 try{
  const file=new File(uri);
  if(file.exists&&file.uri.startsWith(musicDirectory.uri))file.delete();
 }catch{
  // Library metadata remains usable even if cleanup of a missing file fails.
 }
}
