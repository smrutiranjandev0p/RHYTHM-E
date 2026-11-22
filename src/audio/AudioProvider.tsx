import React,{createContext,useContext,useEffect,useMemo,useState} from "react";
import {createAudioPlayer,setAudioModeAsync,useAudioPlayerStatus} from "expo-audio";

export type LocalTrack={id:string;name:string;uri:string;artist:string};
type AudioContextValue={tracks:LocalTrack[];activeIndex:number;activeTrack:LocalTrack|null;status:any;addTracks:(tracks:LocalTrack[])=>void;playTrack:(index:number)=>void;togglePlayback:()=>void;skipNext:()=>void;skipPrevious:()=>void;seekTo:(seconds:number)=>void};
const AudioContext=createContext<AudioContextValue|null>(null);

export function AudioProvider({children}:{children:React.ReactNode}){
 const [player]=useState(()=>createAudioPlayer(null));
 const status=useAudioPlayerStatus(player);
 const [tracks,setTracks]=useState<LocalTrack[]>([]);
 const [activeIndex,setActiveIndex]=useState(-1);
 const activeTrack=activeIndex>=0?tracks[activeIndex]||null:null;
 useEffect(()=>{
  setAudioModeAsync({playsInSilentMode:true,shouldPlayInBackground:true,interruptionMode:"doNotMix"}).catch(()=>{});
  return ()=>{player.clearLockScreenControls();player.remove();};
 },[player]);
 const addTracks=(incoming:LocalTrack[])=>setTracks(old=>{const seen=new Set(old.map(t=>t.uri));return [...old,...incoming.filter(t=>!seen.has(t.uri))];});
 const playTrack=(index:number)=>{
  const track=tracks[index];if(!track)return;
  setActiveIndex(index);
  player.replace({uri:track.uri,name:track.name});
  player.setActiveForLockScreen(true,{title:track.name,artist:track.artist,albumTitle:"RHYTHM E • Local Library"});
  player.play();
 };
 const togglePlayback=()=>{if(status.playing){player.pause();return;}if(activeIndex>=0){player.play();return;}if(tracks.length)playTrack(0);};
 const skipNext=()=>{if(tracks.length)playTrack((activeIndex+1+tracks.length)%tracks.length);};
 const skipPrevious=()=>{if(tracks.length)playTrack((activeIndex-1+tracks.length)%tracks.length);};
 const seekTo=(seconds:number)=>{player.seekTo(Math.max(0,Math.min(seconds,status.duration||0)));};
 const value=useMemo(()=>({tracks,activeIndex,activeTrack,status,addTracks,playTrack,togglePlayback,skipNext,skipPrevious,seekTo}),[tracks,activeIndex,activeTrack,status]);
 return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
export function useAudio(){const value=useContext(AudioContext);if(!value)throw new Error("useAudio must be used inside AudioProvider");return value;}
