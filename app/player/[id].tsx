import {useLocalSearchParams,useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {useAudio} from "../../src/audio/AudioProvider";

const clock=(n:number)=>{if(!Number.isFinite(n))return "0:00";const m=Math.floor(n/60);const sec=Math.floor(n%60);return m+":"+String(sec).padStart(2,"0");};
export default function PlayerScreen(){
 const {id}=useLocalSearchParams<{id:string}>();const router=useRouter();const {activeTrack,status,togglePlayback,skipNext,skipPrevious,seekTo}=useAudio();
 const hasTrack=!!activeTrack;const title=activeTrack?.name||(id==="featured"?"The Midnight Edit":String(id||"Your track").replace(/-/g," "));
 const duration=status.duration||0;const progress=duration>0?Math.min(100,status.currentTime/duration*100):0;
 return <View style={s.screen}>
  <View style={s.header}><TouchableOpacity onPress={()=>router.back()} style={s.back}><MaterialCommunityIcons name="chevron-down" size={28} color="#FFF"/></TouchableOpacity><Text style={s.headerText}>{hasTrack?"NOW PLAYING":"PLAYER PREVIEW"}</Text><TouchableOpacity onPress={()=>router.push({pathname:"/lyrics/[id]",params:{id:String(id||"midnight-drive")}})}><MaterialCommunityIcons name="text" size={23} color="#FFF"/></TouchableOpacity></View>
  <View style={s.art}><View style={s.sun}/><View style={s.orbit}/><View style={s.disc}><MaterialCommunityIcons name="music-note-eighth" size={72} color="#FFF"/></View><Text style={s.artLabel}>RHYTHM E</Text></View>
  <View style={s.song}><View style={{flex:1}}><Text style={s.title} numberOfLines={1}>{title}</Text><Text style={s.artist}>{activeTrack?.artist||"RHYTHM E • DEMO"}</Text></View><MaterialCommunityIcons name="heart-outline" size={25} color="#FF8DBB"/></View>
  <View style={s.wave}>{Array.from({length:39},(_,i)=><View key={i} style={[s.bar,{height:7+(i*17%25),opacity:i<Math.round(progress/100*39)?1:.35}]}/>)}</View>
  <View style={s.progressTrack}><View style={[s.progressFill,{width:progress+"%"}]}/></View>
  <View style={s.times}><Text style={s.muted}>{clock(status.currentTime||0)}</Text><Text style={s.muted}>{duration?clock(duration):"--:--"}</Text></View>
  {hasTrack?<View style={s.controls}><TouchableOpacity onPress={skipPrevious}><MaterialCommunityIcons name="skip-previous" size={34} color="#FFF"/></TouchableOpacity><TouchableOpacity onPress={()=>seekTo((status.currentTime||0)-15)}><MaterialCommunityIcons name="rewind-15" size={26} color="#D8C2DB"/></TouchableOpacity><TouchableOpacity style={s.play} onPress={togglePlayback}><MaterialCommunityIcons name={status.playing?"pause":"play"} size={34} color="#26111D"/></TouchableOpacity><TouchableOpacity onPress={()=>seekTo((status.currentTime||0)+15)}><MaterialCommunityIcons name="fast-forward-15" size={26} color="#D8C2DB"/></TouchableOpacity><TouchableOpacity onPress={skipNext}><MaterialCommunityIcons name="skip-next" size={34} color="#FFF"/></TouchableOpacity></View>:<TouchableOpacity style={s.importButton} onPress={()=>router.push("/(tabs)/library")}><MaterialCommunityIcons name="folder-music" size={19} color="#26111D"/><Text style={s.importText}>IMPORT MUSIC TO PLAY</Text></TouchableOpacity>}
  <TouchableOpacity style={s.lyricsButton} onPress={()=>router.push({pathname:"/lyrics/[id]",params:{id:String(id||"midnight-drive")}})}><MaterialCommunityIcons name="text" size={17} color="#FFF"/><Text style={s.lyricsText}>OPEN LYRICS</Text><MaterialCommunityIcons name="chevron-right" size={18} color="#FFF"/></TouchableOpacity>
  <Text style={s.info}>{hasTrack?"Playing a file selected from your device.":"Choose a local audio file from your Library to start playback."}</Text>
 </View>
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#160D1C",paddingHorizontal:23,paddingTop:55,alignItems:"center"},
 header:{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between"},back:{width:42,height:42,borderRadius:15,backgroundColor:"#FFFFFF14",alignItems:"center",justifyContent:"center"},headerText:{color:"#D9C5DC",fontSize:10,letterSpacing:2,fontWeight:"900"},
 art:{width:285,height:285,borderRadius:32,backgroundColor:"#E84D91",marginTop:33,alignItems:"center",justifyContent:"center",overflow:"hidden"},
 sun:{position:"absolute",width:230,height:230,borderRadius:115,backgroundColor:"#FFB45C",top:-52,right:-40},orbit:{position:"absolute",width:255,height:255,borderRadius:128,borderWidth:2,borderColor:"#FFFFFF65",transform:[{rotate:"-25deg"}]},
 disc:{width:158,height:158,borderRadius:79,backgroundColor:"#672B70",alignItems:"center",justifyContent:"center",borderWidth:8,borderColor:"#FFFFFF35"},artLabel:{position:"absolute",bottom:20,left:20,color:"#FFF",fontSize:10,letterSpacing:3,fontWeight:"900"},
 song:{width:"100%",flexDirection:"row",alignItems:"center",marginTop:24},title:{color:"#FFF",fontSize:21,fontWeight:"900",textTransform:"capitalize"},artist:{color:"#B9A6BD",fontSize:10,letterSpacing:1,marginTop:7},
 wave:{width:"100%",height:29,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:18},bar:{width:3,borderRadius:3,backgroundColor:"#FF8DBB"},
 progressTrack:{height:3,width:"100%",backgroundColor:"#49364D",borderRadius:3,marginTop:7,overflow:"hidden"},progressFill:{height:3,backgroundColor:"#FF75AB"},
 times:{width:"100%",flexDirection:"row",justifyContent:"space-between",marginTop:7},muted:{color:"#907D96",fontSize:10},
 controls:{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:23},play:{width:62,height:62,borderRadius:31,backgroundColor:"#FF9CC4",alignItems:"center",justifyContent:"center"},
 importButton:{marginTop:22,flexDirection:"row",alignItems:"center",gap:9,backgroundColor:"#FF9CC4",paddingHorizontal:18,paddingVertical:15,borderRadius:24},importText:{color:"#26111D",fontSize:10,fontWeight:"900",letterSpacing:1},
 lyricsButton:{marginTop:20,flexDirection:"row",alignItems:"center",gap:10,backgroundColor:"#FFFFFF18",paddingHorizontal:17,paddingVertical:12,borderRadius:22},lyricsText:{color:"#FFF",fontSize:10,fontWeight:"900",letterSpacing:1.5},
 info:{color:"#907D96",fontSize:9,textAlign:"center",marginTop:15}
});