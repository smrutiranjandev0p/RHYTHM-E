import React,{createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import {createAudioPlayer,setAudioModeAsync,useAudioPlayerStatus} from "expo-audio";

export type LocalTrack={id:string;name:string;uri:string;artist:string;album?:string;source?:"Internet Archive"|"Local";license?:string;itemUrl?:string};
type AudioContextValue={
 tracks:LocalTrack[];activeIndex:number;activeTrack:LocalTrack|null;status:any;
 addTracks:(tracks:LocalTrack[])=>void;addAndPlayTrack:(track:LocalTrack)=>void;playTrack:(index:number)=>void;
 toggleFavorite:(id:string)=>void;isFavorite:(id:string)=>boolean;favorites:string[];
 togglePlayback:()=>void;skipNext:()=>void;skipPrevious:()=>void;seekTo:(seconds:number)=>void;
 recentTracks:LocalTrack[];setSleepTimer:(minutes:number)=>void;cancelSleepTimer:()=>void;sleepTimerEndsAt:number|null;
};
const AudioContext=createContext<AudioContextValue|null>(null);

export function AudioProvider({children}:{children:React.ReactNode}){
 const [player]=useState(()=>createAudioPlayer(null));
 const status=useAudioPlayerStatus(player);
 const [tracks,setTracks]=useState<LocalTrack[]>([]);
 const [activeIndex,setActiveIndex]=useState(-1);
 const [favorites,setFavorites]=useState<string[]>([]);
 const [recentTracks,setRecentTracks]=useState<LocalTrack[]>([]);
 const [sleepTimerEndsAt,setSleepTimerEndsAt]=useState<number|null>(null);
 const sleepTimeout=useRef<ReturnType<typeof setTimeout>|null>(null);
 const activeTrack=activeIndex>=0?tracks[activeIndex]||null:null;

 useEffect(()=>{
  setAudioModeAsync({playsInSilentMode:true,shouldPlayInBackground:true,interruptionMode:"doNotMix"}).catch(()=>{});
  return ()=>{if(sleepTimeout.current)clearTimeout(sleepTimeout.current);player.clearLockScreenControls();player.remove();};
 },[player]);

 const addTracks=(incoming:LocalTrack[])=>setTracks(old=>{
  const seen=new Set(old.map(t=>t.uri));
  return [...old,...incoming.filter(t=>!seen.has(t.uri))];
 });
 const remember=(track:LocalTrack)=>setRecentTracks(old=>[track,...old.filter(item=>item.id!==track.id)].slice(0,50));
 const playTrack=(index:number)=>{
  const track=tracks[index];if(!track)return;
  setActiveIndex(index);remember(track);
  player.replace({uri:track.uri,name:track.name});
  player.setActiveForLockScreen(true,{title:track.name,artist:track.artist,albumTitle:track.album|| (track.source==="Internet Archive"?"RHYTHM E • Free Music":"RHYTHM E • Local Library")});
  player.play();
 };
 const addAndPlayTrack=(track:LocalTrack)=>{
  const existing=tracks.findIndex(item=>item.id===track.id);
  if(existing>=0){playTrack(existing);return;}
  const nextIndex=tracks.length;
  setTracks(old=>[...old,track]);setActiveIndex(nextIndex);remember(track);
  player.replace({uri:track.uri,name:track.name});
  player.setActiveForLockScreen(true,{title:track.name,artist:track.artist,albumTitle:track.album||"RHYTHM E"});
  player.play();
 };
 const toggleFavorite=(id:string)=>setFavorites(old=>old.includes(id)?old.filter(item=>item!==id):[...old,id]);
 const isFavorite=(id:string)=>favorites.includes(id);
 const togglePlayback=()=>{if(status.playing){player.pause();return;}if(activeIndex>=0){player.play();return;}if(tracks.length)playTrack(0);};
 const skipNext=()=>{if(tracks.length)playTrack((activeIndex+1+tracks.length)%tracks.length);};
 const skipPrevious=()=>{if(status.currentTime>3){player.seekTo(0);return;}if(tracks.length)playTrack((activeIndex-1+tracks.length)%tracks.length);};
 const seekTo=(seconds:number)=>player.seekTo(Math.max(0,Math.min(seconds,status.duration||0)));
 const cancelSleepTimer=()=>{if(sleepTimeout.current)clearTimeout(sleepTimeout.current);sleepTimeout.current=null;setSleepTimerEndsAt(null);};
 const setSleepTimer=(minutes:number)=>{
  cancelSleepTimer();if(minutes<=0)return;
  const endsAt=Date.now()+minutes*60*1000;setSleepTimerEndsAt(endsAt);
  sleepTimeout.current=setTimeout(()=>{player.pause();sleepTimeout.current=null;setSleepTimerEndsAt(null);},minutes*60*1000);
 };

 useEffect(()=>{if(status.didJustFinish&&activeIndex>=0&&tracks.length>0)playTrack((activeIndex+1)%tracks.length);},[status.didJustFinish]);
 const value=useMemo(()=>({tracks,activeIndex,activeTrack,status,addTracks,addAndPlayTrack,playTrack,toggleFavorite,isFavorite,favorites,togglePlayback,skipNext,skipPrevious,seekTo,recentTracks,setSleepTimer,cancelSleepTimer,sleepTimerEndsAt}),[tracks,activeIndex,activeTrack,status,favorites,recentTracks,sleepTimerEndsAt]);
 return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
export function useAudio(){const value=useContext(AudioContext);if(!value)throw new Error("useAudio must be used inside AudioProvider");return value;}
