import {useLocalSearchParams,useRouter} from "expo-router";
import {useColorScheme} from "react-native";
import {useAppSettings,getThemePalette} from "../../src/settings/SettingsProvider";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {useAudio} from "../../src/audio/AudioProvider";
export default function AlbumScreen(){
 const {theme}=useAppSettings();const p=getThemePalette(theme,useColorScheme());
 const {name,artist:artistParam}=useLocalSearchParams<{name:string;artist?:string}>();const router=useRouter();const {tracks,playTrack}=useAudio();
 const album=String(name||"Singles");const artist=String(artistParam||"");
 const items=tracks.map((track,index)=>({track,index})).filter(item=>(item.track.album||"Singles")===album&&(!artist||item.track.artist===artist));
 return <ScrollView style={[s.screen,{backgroundColor:p.background}]} contentContainerStyle={s.content}>
  <TouchableOpacity style={[s.back,{backgroundColor:p.surfaceAlt}]} onPress={()=>router.back()}><MaterialCommunityIcons name="chevron-left" size={24} color="#FFF"/></TouchableOpacity>
  <View style={s.hero}><View style={s.disc}><MaterialCommunityIcons name="album" size={47} color="#FFF"/></View><Text style={s.kicker}>ALBUM</Text><Text style={[s.title,{color:p.text}]}>{album}</Text><Text style={s.sub}>{artist||"Various artists"} · {items.length} track{items.length===1?"":"s"}</Text></View>
  <Text style={[s.heading,{color:p.text}]}>Tracklist</Text>
  {items.length===0?<Text style={[s.empty,{color:p.muted,backgroundColor:p.surface}]}>No tracks in this album in your current library.</Text>:items.map(({track,index},position)=><TouchableOpacity key={track.id} style={[s.item,{borderBottomColor:p.border}]} onPress={()=>{playTrack(index);router.push("/player/local");}}><Text style={[s.number,{color:p.muted}]}>{String(position+1).padStart(2,"0")}</Text><View style={{flex:1}}><Text style={[s.track,{color:p.text}]}>{track.name}</Text><Text style={[s.meta,{color:p.muted}]}>{track.artist}</Text></View><MaterialCommunityIcons name="play-circle-outline" size={24} color="#FF9CC4"/></TouchableOpacity>)}
 </ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#160D1C"},content:{padding:22,paddingTop:55,paddingBottom:50},back:{width:42,height:42,borderRadius:14,backgroundColor:"#2B1B30",alignItems:"center",justifyContent:"center"},hero:{alignItems:"center",backgroundColor:"#397E79",borderRadius:24,padding:24,marginTop:18},disc:{width:104,height:104,borderRadius:22,backgroundColor:"#FFFFFF20",alignItems:"center",justifyContent:"center"},kicker:{color:"#DDF7F1",fontSize:9,letterSpacing:2,fontWeight:"900",marginTop:14},title:{color:"#FFF",fontSize:27,fontWeight:"900",textAlign:"center",marginTop:8},sub:{color:"#DDF7F1",fontSize:10,marginTop:7},heading:{color:"#FFF",fontSize:17,fontWeight:"900",marginTop:27,marginBottom:12},item:{flexDirection:"row",alignItems:"center",gap:13,paddingVertical:12,borderBottomWidth:1,borderBottomColor:"#39283F"},number:{color:"#A98EAA",fontSize:11,width:22},track:{color:"#FFF",fontSize:12,fontWeight:"800"},meta:{color:"#A98EAA",fontSize:9,marginTop:4},empty:{color:"#B9A6BD",backgroundColor:"#25192B",padding:16,borderRadius:15,fontSize:11}});
