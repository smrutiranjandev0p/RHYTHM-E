import {useLocalSearchParams,useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import {useAudio} from "../../src/audio/AudioProvider";
export default function ArtistScreen(){
 const {name}=useLocalSearchParams<{name:string}>();const router=useRouter();const {tracks,playTrack}=useAudio();
 const artist=String(name||"Unknown artist");const items=tracks.map((track,index)=>({track,index})).filter(item=>item.track.artist===artist);
 return <ScrollView style={s.screen} contentContainerStyle={s.content}>
  <TouchableOpacity style={s.back} onPress={()=>router.back()}><MaterialCommunityIcons name="chevron-left" size={24} color="#FFF"/></TouchableOpacity>
  <View style={s.hero}><MaterialCommunityIcons name="account-music" size={52} color="#FFE0EE"/><Text style={s.kicker}>ARTIST</Text><Text style={s.title}>{artist}</Text><Text style={s.sub}>{items.length} track{items.length===1?"":"s"} in your library</Text></View>
  <Text style={s.heading}>Tracks</Text>
  {items.length===0?<Text style={s.empty}>No tracks from this artist in your current library.</Text>:items.map(({track,index})=><TouchableOpacity key={track.id} style={s.item} onPress={()=>{playTrack(index);router.push("/player/local");}}><View style={s.art}><MaterialCommunityIcons name="music-note" size={22} color="#FFF"/></View><View style={{flex:1}}><Text style={s.track}>{track.name}</Text><Text style={s.meta}>{track.album||"Single"}</Text></View><MaterialCommunityIcons name="play-circle-outline" size={24} color="#FF9CC4"/></TouchableOpacity>)}
 </ScrollView>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#160D1C"},content:{padding:22,paddingTop:55,paddingBottom:50},back:{width:42,height:42,borderRadius:14,backgroundColor:"#2B1B30",alignItems:"center",justifyContent:"center"},hero:{alignItems:"center",backgroundColor:"#8D4E8C",borderRadius:24,padding:24,marginTop:18},kicker:{color:"#FFE0EE",fontSize:9,letterSpacing:2,fontWeight:"900",marginTop:14},title:{color:"#FFF",fontSize:27,fontWeight:"900",textAlign:"center",marginTop:8},sub:{color:"#FFE0EE",fontSize:10,marginTop:7},heading:{color:"#FFF",fontSize:17,fontWeight:"900",marginTop:27,marginBottom:12},item:{flexDirection:"row",alignItems:"center",gap:12,paddingVertical:9,borderBottomWidth:1,borderBottomColor:"#39283F"},art:{width:46,height:46,borderRadius:13,backgroundColor:"#C34E7D",alignItems:"center",justifyContent:"center"},track:{color:"#FFF",fontSize:12,fontWeight:"800"},meta:{color:"#A98EAA",fontSize:9,marginTop:4},empty:{color:"#B9A6BD",backgroundColor:"#25192B",padding:16,borderRadius:15,fontSize:11}});
