import {useEffect,useMemo,useState} from "react";
import {useLocalSearchParams,useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ActivityIndicator,ScrollView,StyleSheet,Text,TouchableOpacity,View,useColorScheme} from "react-native";
import {useAudio} from "../../src/audio/AudioProvider";
import {findLyrics,parseSyncedLyrics,TimedLyric} from "../../src/lyrics/lrclib";
import {useAppSettings,getThemePalette} from "../../src/settings/SettingsProvider";

export default function LyricsScreen(){
 const {id}=useLocalSearchParams<{id:string}>();const router=useRouter();
 const {activeTrack,status}=useAudio();const {theme}=useAppSettings();const palette=getThemePalette(theme,useColorScheme());
 const title=activeTrack?.name||String(id||"").replace(/-/g," ");
 const artist=activeTrack?.artist||"";
 const [lyrics,setLyrics]=useState<{plainLyrics:string|null;syncedLyrics:string|null;instrumental?:boolean}|null>(null);
 const [loading,setLoading]=useState(false);const [error,setError]=useState("");
 useEffect(()=>{let live=true;setLoading(true);setError("");setLyrics(null);
  if(!title||!artist||artist==="Local audio"){setLoading(false);setError("Lyrics search needs a track title and artist. Imported files may not contain searchable artist metadata.");return;}
  findLyrics(title,artist,status.duration).then(result=>{if(live){setLyrics(result);if(!result)setError("No lyrics are available for this track.");}}).catch(e=>{if(live)setError(e instanceof Error?e.message:"Lyrics could not be loaded.");}).finally(()=>{if(live)setLoading(false);});
  return()=>{live=false;};
 },[title,artist,status.duration]);
 const timed=useMemo<TimedLyric[]>(()=>lyrics?.syncedLyrics?parseSyncedLyrics(lyrics.syncedLyrics):[],[lyrics]);
 const activeLine=timed.reduce((found,line,index)=>line.time<=status.currentTime?index:found,-1);
 const plain=lyrics?.plainLyrics?.split(/\r?\n/)||[];
 return <View style={[s.screen,{backgroundColor:palette.background}]}>
  <View style={s.header}><TouchableOpacity style={s.iconButton} onPress={()=>router.back()}><MaterialCommunityIcons name="chevron-down" size={27} color="#FFF"/></TouchableOpacity><View style={{alignItems:"center"}}><Text style={s.kicker}>SING ALONG</Text><Text style={s.headerTitle}>LYRICS</Text></View><View style={s.iconButton}><MaterialCommunityIcons name="music-note" size={22} color="#FFF"/></View></View>
  <View style={s.track}><View style={s.cover}><MaterialCommunityIcons name="music-note" size={28} color="#FFF"/></View><View style={{flex:1}}><Text style={s.title} numberOfLines={1}>{title}</Text><Text style={s.artist}>{artist||"Unknown artist"}</Text></View><MaterialCommunityIcons name="waveform" size={25} color="#FF83B7"/></View>
  {loading?<View style={s.center}><ActivityIndicator color="#FF9CC4" size="large"/><Text style={s.message}>Finding lyrics…</Text></View>:error?<View style={s.center}><MaterialCommunityIcons name="text-box-search-outline" size={42} color="#FF9CC4"/><Text style={s.message}>{error}</Text><Text style={s.sub}>Lyrics provided by LRCLIB when available.</Text></View>:lyrics?.instrumental?<View style={s.center}><Text style={s.message}>Instrumental track</Text></View>:<ScrollView contentContainerStyle={s.lyrics} showsVerticalScrollIndicator={false}>
   {timed.length>0?timed.map((line,index)=><Text key={index} style={[s.line,index===activeLine?s.active:s.inactive]}>{line.text||"♪"}</Text>):plain.map((line,index)=><Text key={index} style={s.plain}>{line||" "}</Text>)}
   {!timed.length&&<Text style={s.sub}>Plain lyrics · No timing data available</Text>}
  </ScrollView>}
  <View style={s.bottom}><View style={s.controls}><TouchableOpacity onPress={()=>router.back()}><MaterialCommunityIcons name="chevron-down" size={28} color="#FFF"/></TouchableOpacity><View style={s.play}><MaterialCommunityIcons name={status.playing?"waveform":"pause"} size={24} color="#23111D"/></View><Text style={s.now}>{status.playing?"PLAYING":"PAUSED"}</Text></View><Text style={s.note}>Lyrics by LRCLIB · availability varies by track</Text></View>
 </View>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#160D1C",paddingTop:52,paddingHorizontal:22},header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},iconButton:{width:42,height:42,borderRadius:15,backgroundColor:palette.surfaceAlt,alignItems:"center",justifyContent:"center"},kicker:{color:"#FF8DBB",fontSize:9,letterSpacing:2,fontWeight:"900"},headerTitle:{color:palette.text,fontSize:12,letterSpacing:2,fontWeight:"900",marginTop:3},track:{flexDirection:"row",alignItems:"center",gap:12,marginTop:28,padding:13,borderRadius:18,backgroundColor:palette.surface},cover:{width:48,height:48,borderRadius:14,backgroundColor:"#E34D91",alignItems:"center",justifyContent:"center"},title:{color:palette.text,fontSize:14,fontWeight:"900"},artist:{color:palette.muted,fontSize:9,letterSpacing:1,marginTop:5},lyrics:{paddingTop:30,paddingBottom:25},line:{fontSize:22,fontWeight:"900",lineHeight:34,marginBottom:12,textAlign:"center"},active:{color:"#FF9CC4",transform:[{scale:1.02}]},inactive:{color:"#806D86"},plain:{color:palette.text,fontSize:18,lineHeight:30,textAlign:"center",marginBottom:8},center:{flex:1,alignItems:"center",justifyContent:"center",paddingHorizontal:20},message:{color:palette.text,fontSize:15,fontWeight:"800",textAlign:"center",marginTop:15},sub:{color:palette.muted,fontSize:10,textAlign:"center",marginTop:10,lineHeight:16},bottom:{paddingBottom:24},controls:{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:24,marginTop:12},play:{width:48,height:48,borderRadius:24,backgroundColor:"#FF9CC4",alignItems:"center",justifyContent:"center"},now:{color:palette.muted,fontSize:9,fontWeight:"900",letterSpacing:1},note:{color:palette.muted,fontSize:9,textAlign:"center",marginTop:13}});
