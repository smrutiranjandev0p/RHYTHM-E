import React,{createContext,useContext,useEffect,useMemo,useState} from "react";
import {createAudioPlayer,setAudioModeAsync,useAudioPlayerStatus} from "expo-audio";

export type LocalTrack={id:string;name:string;uri:string;artist:string;source?:"Internet Archive"|"Local";license?:string;itemUrl?:string};
type AudioContextValue={tracks:LocalTrack[];activeIndex:number;activeTrack:LocalTrack|null;status:any;addTracks:(tracks:LocalTrack[])=>void;addAndPlayTrack:(track:LocalTrack)=>void;playTrack:(index:number)=>void;toggleFavorite:(id:string)=>void;isFavorite:(id:string)=>boolean;favorites:string[];togglePlayback:()=>void;skipNext:()=>void;skipPrevious:()=>void;seekTo:(seconds:number)=>void};
const AudioContext=createContext<AudioContextValue|null>(null);

export function AudioProvider({children}:{children:React.ReactNode}){
 const [player]=useState(()=>createAudioPlayer(null));
 const status=useAudioPlayerStatus(player);
 const [tracks,setTracks]=useState<LocalTrack[]>([]);
 const [activeIndex,setActiveIndex]=useState(-1);\n const [favorites,setFavorites]=useState<string[]>([]);
 const activeTrack=activeIndex>=0?tracks[activeIndex]||null:null;
 useEffect(()=>{
  setAudioModeAsync({playsInSilentMode:true,shouldPlayInBackground:true,interruptionMode:"doNotMix"}).catch(()=>{});
  return ()=>{player.clearLockScreenControls();player.remove();};
 },[player]);
 const addTracks=(incoming:LocalTrack[])=>setTracks(old=>{const seen=new Set(old.map(t=>t.uri));return [...old,...incoming.filter(t=>!seen.has(t.uri))];});
 const addAndPlayTrack=(track:LocalTrack)=>{\n  const existing=tracks.findIndex(item=>item.id===track.id);\n  const index=existing>=0?existing:tracks.length;\n  if(existing<0)setTracks(old=>[...old,track]);\n  setActiveIndex(index);\n  player.replace({uri:track.uri,name:track.name});\n  player.setActiveForLockScreen(true,{title:track.name,artist:track.artist,albumTitle:track.source==="Internet Archive"?"RHYTHM E • Free Music":"RHYTHM E • Local Library"});\n  player.play();\n };\n const toggleFavorite=(id:string)=>setFavorites(old=>old.includes(id)?old.filter(item=>item!==id):[...old,id]);\n const isFavorite=(id:string)=>favorites.includes(id);\n const playTrack=(index:number)=>{
  const track=tracks[index];if(!track)return;
  setActiveIndex(index);
  player.replace({uri:track.uri,name:track.name});
  player.setActiveForLockScreen(true,{title:track.name,artist:track.artist,albumTitle:track.source==="Internet Archive"?"RHYTHM E • Free Music":"RHYTHM E • Local Library"});
  player.play();
 };
 const togglePlayback=()=>{if(status.playing){player.pause();return;}if(activeIndex>=0){player.play();return;}if(tracks.length)playTrack(0);};
 const skipNext=()=>{if(tracks.length)playTrack((activeIndex+1+tracks.length)%tracks.length);};
 const skipPrevious=()=>{if(tracks.length)playTrack((activeIndex-1+tracks.length)%tracks.length);};
 const seekTo=(seconds:number)=>{player.seekTo(Math.max(0,Math.min(seconds,status.duration||0)));};
 // Keep Flow continuous: move to the next queued track when playback ends.
 useEffect(()=>{if(status.didJustFinish&&activeIndex>=0&&tracks.length>0){playTrack((activeIndex+1)%tracks.length);}},[status.didJustFinish,activeIndex,tracks.length]);
 const value=useMemo(()=>({tracks,activeIndex,activeTrack,status,addTracks,addAndPlayTrack,playTrack,toggleFavorite,isFavorite,favorites,togglePlayback,skipNext,skipPrevious,seekTo}),[tracks,activeIndex,activeTrack,status,favorites]);
 return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
export function useAudio(){const value=useContext(AudioContext);if(!value)throw new Error("useAudio must be used inside AudioProvider");return value;}
