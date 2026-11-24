import React,{createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {createAudioPlayer,setAudioModeAsync,useAudioPlayerStatus} from "expo-audio";
import {isManagedAudio,migrateImportedAudio} from "./libraryStorage";
import {resolveCataloguePlaybackUrl,validateCataloguePlaybackUrl} from "../../modules/newpipe-extractor";

export type LocalTrack={id:string;name:string;uri:string;artist:string;album?:string;source?:"Audius"|"Internet Archive"|"Wikimedia Commons"|"Local";license?:string;rightsLabel?:string;itemUrl?:string;artworkUrl?:string;duration?:number};
type PersistedMusic={tracks:LocalTrack[];favorites:string[];recentTracks:LocalTrack[];activeTrackId:string|null};
export type ListeningStats={totalSeconds:number;dailySeconds:Record<string,number>;lastPlayedDay:string|null;};
const STATS_KEY="rhythm-e.listening-stats.v1";
const localDay=()=>{const d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const emptyStats:ListeningStats={totalSeconds:0,dailySeconds:{},lastPlayedDay:null};
type AudioContextValue={
 tracks:LocalTrack[];activeIndex:number;activeTrack:LocalTrack|null;status:any;
 addTracks:(tracks:LocalTrack[])=>void;updateTrack:(id:string,changes:Partial<Pick<LocalTrack,"name"|"artist"|"album">>)=>void;addAndPlayTrack:(track:LocalTrack)=>Promise<void>;playTrack:(index:number)=>void;
 toggleFavorite:(id:string)=>void;isFavorite:(id:string)=>boolean;favorites:string[];
 togglePlayback:()=>void;skipNext:()=>void;skipPrevious:()=>void;seekTo:(seconds:number)=>void;
 recentTracks:LocalTrack[];listeningStats:ListeningStats;setSleepTimer:(minutes:number)=>void;cancelSleepTimer:()=>void;sleepTimerEndsAt:number|null;
};
const AudioContext=createContext<AudioContextValue|null>(null);
const STORAGE_KEY="rhythm-e.music-library.v1";

export function AudioProvider({children}:{children:React.ReactNode}){
 const [player]=useState(()=>createAudioPlayer(null));
 const status=useAudioPlayerStatus(player);
 const [tracks,setTracks]=useState<LocalTrack[]>([]);
 const [activeIndex,setActiveIndex]=useState(-1);
 const [favorites,setFavorites]=useState<string[]>([]);
 const [recentTracks,setRecentTracks]=useState<LocalTrack[]>([]);
 const [listeningStats,setListeningStats]=useState<ListeningStats>(emptyStats);
 const [statsReady,setStatsReady]=useState(false);
 const lastSample=useRef<{time:number;trackId:string|null;playing:boolean}>({time:0,trackId:null,playing:false});
 const [storageReady,setStorageReady]=useState(false);
 const [sleepTimerEndsAt,setSleepTimerEndsAt]=useState<number|null>(null);
 const sleepTimeout=useRef<ReturnType<typeof setTimeout>|null>(null);
 const activePlaybackRequest=useRef(0);
 const activeTrack=activeIndex>=0?tracks[activeIndex]||null:null;

 useEffect(()=>{let mounted=true;AsyncStorage.getItem(STATS_KEY).then(raw=>{if(raw&&mounted){const saved=JSON.parse(raw) as Partial<ListeningStats>;setListeningStats({totalSeconds:Math.max(0,Number(saved.totalSeconds)||0),dailySeconds:saved.dailySeconds&&typeof saved.dailySeconds==="object"?saved.dailySeconds:{},lastPlayedDay:typeof saved.lastPlayedDay==="string"?saved.lastPlayedDay:null});}}).catch(()=>{}).finally(()=>{if(mounted)setStatsReady(true);});return()=>{mounted=false;};},[]);
 useEffect(()=>{if(!statsReady)return;AsyncStorage.setItem(STATS_KEY,JSON.stringify(listeningStats)).catch(()=>{});},[statsReady,listeningStats]);
 useEffect(()=>{if(!status.playing||!activeTrack)return;const interval=setInterval(()=>{setListeningStats(old=>{const day=localDay();return {...old,totalSeconds:old.totalSeconds+5,dailySeconds:{...old.dailySeconds,[day]:(old.dailySeconds[day]||0)+5},lastPlayedDay:day};});},5000);return()=>clearInterval(interval);},[status.playing,activeTrack?.id]);
 useEffect(()=>{
  let mounted=true;
  AsyncStorage.getItem(STORAGE_KEY).then(async raw=>{
   if(!raw||!mounted)return;
   try{
    const saved=JSON.parse(raw) as Partial<PersistedMusic>;
    let restored=Array.isArray(saved.tracks)?saved.tracks.filter(t=>t&&typeof t.uri==="string"&&typeof t.id==="string"):[];
    restored=await Promise.all(restored.map(async track=>{
     if(track.source!=="Local"||isManagedAudio(track.uri))return track;
     try{return {...track,uri:await migrateImportedAudio(track.uri,track.id,track.name)};}catch{return track;}
    }));
    if(!mounted)return;
    setTracks(restored);
    setFavorites(Array.isArray(saved.favorites)?saved.favorites.filter(x=>typeof x==="string"):[]);
    setRecentTracks(Array.isArray(saved.recentTracks)?saved.recentTracks.filter(t=>t&&typeof t.uri==="string").slice(0,50):[]);
    const active=saved.activeTrackId?restored.findIndex(t=>t.id===saved.activeTrackId):-1;
    setActiveIndex(active);
    if(active>=0){const track=restored[active];player.replace({uri:track.uri,name:track.name});player.setActiveForLockScreen(true,{title:track.name,artist:track.artist,albumTitle:track.album||"RHYTHM E"});}
   }catch{ /* Ignore damaged saved data and start with an empty library. */ }
  }).catch(()=>{}).finally(()=>{if(mounted)setStorageReady(true);});
  return ()=>{mounted=false;};
 },[]);

 useEffect(()=>{
  if(!storageReady)return;
  const payload:PersistedMusic={tracks,favorites,recentTracks,activeTrackId:activeTrack?.id||null};
  AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(payload)).catch(()=>{});
 },[storageReady,tracks,favorites,recentTracks,activeTrack?.id]);

 useEffect(()=>{
  setAudioModeAsync({playsInSilentMode:true,shouldPlayInBackground:true,interruptionMode:"doNotMix"}).catch(()=>{});
  return ()=>{if(sleepTimeout.current)clearTimeout(sleepTimeout.current);player.clearLockScreenControls();player.remove();};
 },[player]);

 const updateTrack=(id:string,changes:Partial<Pick<LocalTrack,"name"|"artist"|"album">>)=>{
  setTracks(old=>old.map(track=>track.id===id?{...track,...changes}:track));
  setRecentTracks(old=>old.map(track=>track.id===id?{...track,...changes}:track));
 };
 const addTracks=(incoming:LocalTrack[])=>setTracks(old=>{
  const seen=new Set(old.map(t=>t.uri));
  return [...old,...incoming.filter(t=>!seen.has(t.uri))];
 });
 const remember=(track:LocalTrack)=>setRecentTracks(old=>[track,...old.filter(item=>item.id!==track.id)].slice(0,50));
 const resolveTrackUri=async(track:LocalTrack)=>{
  if(!track.source||track.source==="Local")return track.uri;
  const validation=validateCataloguePlaybackUrl(track.uri);
  if(!validation.valid)throw new Error("This catalogue playback URL is not an approved RHYTHM E source.");
  const resolved=await resolveCataloguePlaybackUrl(track.uri,track.id);
  return resolved.playbackUrl;
 };
 const playTrack=(index:number)=>{
  const track=tracks[index];if(!track)return;
  const requestId=++activePlaybackRequest.current;
  setActiveIndex(index);remember(track);
  void resolveTrackUri(track).then(uri=>{
   if(activePlaybackRequest.current!==requestId)return;
   player.replace({uri,name:track.name});
   player.setActiveForLockScreen(true,{title:track.name,artist:track.artist,albumTitle:track.album||(track.source?`RHYTHM E • ${track.source}`:"RHYTHM E • Local Library")});
   player.play();
  }).catch(error=>console.warn("RHYTHM E playback resolution failed",error));
 };
 const addAndPlayTrack=async(track:LocalTrack)=>{
  const existing=tracks.findIndex(item=>item.id===track.id);
  if(existing>=0){playTrack(existing);return;}
  const requestId=++activePlaybackRequest.current;
  const playbackUri=await resolveTrackUri(track);
  if(activePlaybackRequest.current!==requestId)return;
  const nextIndex=tracks.length;
  setTracks(old=>[...old,track]);setActiveIndex(nextIndex);remember(track);
  player.replace({uri:playbackUri,name:track.name});
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
 const value=useMemo(()=>({tracks,activeIndex,activeTrack,status,addTracks,updateTrack,addAndPlayTrack,playTrack,toggleFavorite,isFavorite,favorites,togglePlayback,skipNext,skipPrevious,seekTo,recentTracks,listeningStats,setSleepTimer,cancelSleepTimer,sleepTimerEndsAt}),[tracks,activeIndex,activeTrack,status,favorites,recentTracks,listeningStats,sleepTimerEndsAt]);
 return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
export function useAudio(){const value=useContext(AudioContext);if(!value)throw new Error("useAudio must be used inside AudioProvider");return value;}
