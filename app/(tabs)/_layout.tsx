import {Tabs,useRouter,useSegments} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {useAudio} from "../../src/audio/AudioProvider";

function MiniPlayer(){
 const router=useRouter();const segments=useSegments();const {activeTrack,status,togglePlayback}=useAudio();
 if(!activeTrack||segments.includes("flow"))return null;
 return <TouchableOpacity activeOpacity={0.92} style={s.mini} onPress={()=>router.push("/player/local")}>
  <View style={s.miniArt}><MaterialCommunityIcons name="music-note" size={19} color="#FFF"/></View>
  <View style={{flex:1}}><Text style={s.miniTitle} numberOfLines={1}>{activeTrack.name}</Text><Text style={s.miniArtist} numberOfLines={1}>{activeTrack.artist}</Text></View>
  <TouchableOpacity onPress={togglePlayback} hitSlop={10} style={s.miniControl}><MaterialCommunityIcons name={status.playing?"pause":"play"} size={25} color="#FFF"/></TouchableOpacity>
  <MaterialCommunityIcons name="playlist-music" size={21} color="#FFB5D1"/>
 </TouchableOpacity>
}
export default function TabLayout(){const segments=useSegments();const immersiveFlow=segments.includes("flow");return <View style={s.root}><Tabs screenOptions={{headerShown:false,tabBarStyle:immersiveFlow?{...s.tabBar,display:"none"}:s.tabBar,tabBarActiveTintColor:"#FF9CC4",tabBarInactiveTintColor:"#887B90",tabBarLabelStyle:s.label,tabBarItemStyle:{paddingTop:5},sceneStyle:{backgroundColor:"#160D1C"}}}>
 <Tabs.Screen name="index" options={{title:"Home",tabBarIcon:({color,size})=><MaterialCommunityIcons name="home-variant" color={color} size={size}/>}}/>
 <Tabs.Screen name="discover" options={{title:"Discover",tabBarIcon:({color,size})=><MaterialCommunityIcons name="compass-outline" color={color} size={size}/>}}/>
 <Tabs.Screen name="flow" options={{title:"Flow",tabBarIcon:({color,size})=><MaterialCommunityIcons name="waveform" color={color} size={size+2}/>}}/>
 <Tabs.Screen name="search" options={{title:"Search",tabBarIcon:({color,size})=><MaterialCommunityIcons name="magnify" color={color} size={size+3}/>}}/>
 <Tabs.Screen name="library" options={{title:"Library",tabBarIcon:({color,size})=><MaterialCommunityIcons name="music-box-multiple-outline" color={color} size={size}/>}}/>
 <Tabs.Screen name="profile" options={{title:"You",tabBarIcon:({color,size})=><MaterialCommunityIcons name="account-circle-outline" color={color} size={size}/>}}/>
 </Tabs><MiniPlayer/></View>}
const s=StyleSheet.create({root:{flex:1,backgroundColor:"#160D1C"},tabBar:{position:"absolute",height:76,paddingTop:8,paddingBottom:10,backgroundColor:"#211728",borderTopWidth:1,borderTopColor:"#3A2A40",elevation:18},label:{fontSize:9,fontWeight:"800",marginTop:1},mini:{position:"absolute",left:12,right:12,bottom:83,height:59,borderRadius:17,backgroundColor:"#38243B",borderWidth:1,borderColor:"#70445F",flexDirection:"row",alignItems:"center",paddingHorizontal:11,gap:11,elevation:14},miniArt:{width:37,height:37,borderRadius:11,backgroundColor:"#C34E7D",alignItems:"center",justifyContent:"center"},miniTitle:{color:"#FFF",fontSize:11,fontWeight:"900"},miniArtist:{color:"#D0B9CF",fontSize:9,marginTop:3},miniControl:{padding:3}});
