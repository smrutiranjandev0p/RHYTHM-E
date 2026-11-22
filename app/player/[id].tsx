import {useLocalSearchParams,useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet,Text,TouchableOpacity,View} from "react-native";

export default function PlayerScreen(){
 const {id}=useLocalSearchParams<{id:string}>();const router=useRouter();
 const title=id==="featured"?"The Midnight Edit":String(id||"Your track").replace(/-/g," ");
 return <View style={s.screen}>
  <View style={s.header}><TouchableOpacity onPress={()=>router.back()} style={s.back}><MaterialCommunityIcons name="chevron-down" size={28} color="#FFF"/></TouchableOpacity><Text style={s.headerText}>NOW PLAYING</Text><TouchableOpacity onPress={()=>router.push({pathname:"/lyrics/[id]",params:{id:String(id||"midnight-drive")}})}><MaterialCommunityIcons name="text" size={23} color="#FFF"/></TouchableOpacity></View>
  <View style={s.art}><View style={s.sun}/><View style={s.orbit}/><View style={s.disc}><MaterialCommunityIcons name="music-note-eighth" size={72} color="#FFF"/></View><Text style={s.artLabel}>RHYTHM E</Text></View>
  <View style={s.song}><View style={{flex:1}}><Text style={s.title}>{title}</Text><Text style={s.artist}>RHYTHM E • ORIGINAL DEMO</Text></View><MaterialCommunityIcons name="heart-outline" size={25} color="#FF8DBB"/></View>
  <View style={s.wave}>{Array.from({length:39},(_,i)=><View key={i} style={[s.bar,{height:7+(i*17%25),opacity:i<11?1:.35}]}/>)}</View>
  <View style={s.times}><Text style={s.muted}>00:00</Text><Text style={s.muted}>--:--</Text></View>
  <View style={s.controls}><MaterialCommunityIcons name="shuffle" size={21} color="#BBA9C0"/><MaterialCommunityIcons name="skip-previous" size={34} color="#FFF"/><View style={s.play}><MaterialCommunityIcons name="play" size={34} color="#26111D"/></View><MaterialCommunityIcons name="skip-next" size={34} color="#FFF"/><MaterialCommunityIcons name="repeat" size={21} color="#BBA9C0"/></View>
  <TouchableOpacity style={s.lyricsButton} onPress={()=>router.push({pathname:"/lyrics/[id]",params:{id:String(id||"midnight-drive")}})}><MaterialCommunityIcons name="text" size={17} color="#FFF"/><Text style={s.lyricsText}>OPEN LYRICS</Text><MaterialCommunityIcons name="chevron-right" size={18} color="#FFF"/></TouchableOpacity>
  <Text style={s.info}>Player concept preview • Real audio engine is not connected yet</Text>
 </View>
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#160D1C",paddingHorizontal:23,paddingTop:55,alignItems:"center"},
 header:{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between"},back:{width:42,height:42,borderRadius:15,backgroundColor:"#FFFFFF14",alignItems:"center",justifyContent:"center"},headerText:{color:"#D9C5DC",fontSize:10,letterSpacing:2,fontWeight:"900"},
 art:{width:285,height:285,borderRadius:32,backgroundColor:"#E84D91",marginTop:33,alignItems:"center",justifyContent:"center",overflow:"hidden"},
 sun:{position:"absolute",width:230,height:230,borderRadius:115,backgroundColor:"#FFB45C",top:-52,right:-40},orbit:{position:"absolute",width:255,height:255,borderRadius:128,borderWidth:2,borderColor:"#FFFFFF65",transform:[{rotate:"-25deg"}]},
 disc:{width:158,height:158,borderRadius:79,backgroundColor:"#672B70",alignItems:"center",justifyContent:"center",borderWidth:8,borderColor:"#FFFFFF35"},artLabel:{position:"absolute",bottom:20,left:20,color:"#FFF",fontSize:10,letterSpacing:3,fontWeight:"900"},
 song:{width:"100%",flexDirection:"row",alignItems:"center",marginTop:29},title:{color:"#FFF",fontSize:22,fontWeight:"900",textTransform:"capitalize"},artist:{color:"#B9A6BD",fontSize:10,letterSpacing:1,marginTop:7},
 wave:{width:"100%",height:38,flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:26},bar:{width:3,borderRadius:3,backgroundColor:"#FF8DBB"},
 times:{width:"100%",flexDirection:"row",justifyContent:"space-between",marginTop:5},muted:{color:"#907D96",fontSize:10},
 controls:{width:"100%",flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:24},play:{width:65,height:65,borderRadius:33,backgroundColor:"#FF9CC4",alignItems:"center",justifyContent:"center"},
 lyricsButton:{marginTop:24,flexDirection:"row",alignItems:"center",gap:10,backgroundColor:"#FFFFFF18",paddingHorizontal:17,paddingVertical:12,borderRadius:22},lyricsText:{color:"#FFF",fontSize:10,fontWeight:"900",letterSpacing:1.5},
 info:{color:"#907D96",fontSize:9,textAlign:"center",marginTop:17}
});