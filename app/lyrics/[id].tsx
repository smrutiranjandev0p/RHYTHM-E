import {useLocalSearchParams,useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ScrollView,StyleSheet,Text,TouchableOpacity,View} from "react-native";

const lines=[
  "City lights are falling slow",
  "A thousand dreams in afterglow",
  "We find a rhythm of our own",
  "A little wild, a little home",
  "",
  "Stay until the sky turns gold",
  "Let the night become our own",
  "Every heartbeat, every sound",
  "Lifts us up above the ground"
];

export default function LyricsScreen(){
  const {id}=useLocalSearchParams<{id:string}>();
  const router=useRouter();
  const title=String(id||"midnight-drive").replace(/-/g," ");
  return <View style={s.screen}>
    <View style={s.header}>
      <TouchableOpacity style={s.iconButton} onPress={()=>router.back()}><MaterialCommunityIcons name="chevron-down" size={27} color="#FFF"/></TouchableOpacity>
      <View style={{alignItems:"center"}}><Text style={s.kicker}>SING ALONG</Text><Text style={s.headerTitle}>LYRICS</Text></View>
      <View style={s.iconButton}><MaterialCommunityIcons name="dots-horizontal" size={23} color="#FFF"/></View>
    </View>
    <View style={s.track}><View style={s.cover}><MaterialCommunityIcons name="music-note" size={28} color="#FFF"/></View><View style={{flex:1}}><Text style={s.title}>{title}</Text><Text style={s.artist}>RHYTHM E SESSIONS • DEMO</Text></View><MaterialCommunityIcons name="waveform" size={25} color="#FF83B7"/></View>
    <ScrollView contentContainerStyle={s.lyrics} showsVerticalScrollIndicator={false}>
      <Text style={s.small}>VERSE 01</Text>
      {lines.map((line,i)=><Text key={i} style={[s.line,i<4?s.active:s.inactive]}>{line||" "}</Text>)}
      <View style={s.end}><Text style={s.small}>ORIGINAL DEMO LYRICS</Text></View>
    </ScrollView>
    <View style={s.bottom}><View style={s.progress}><View style={s.progressFill}/></View><View style={s.controls}><MaterialCommunityIcons name="skip-previous" size={28} color="#FFF"/><View style={s.play}><MaterialCommunityIcons name="play" size={27} color="#23111D"/></View><MaterialCommunityIcons name="skip-next" size={28} color="#FFF"/></View><Text style={s.note}>Lyrics preview • Audio playback is coming next</Text></View>
  </View>
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#160D1C",paddingTop:52,paddingHorizontal:22},
 header:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
 iconButton:{width:42,height:42,borderRadius:15,backgroundColor:"#FFFFFF14",alignItems:"center",justifyContent:"center"},
 kicker:{color:"#FF8DBB",fontSize:9,letterSpacing:2,fontWeight:"900"},headerTitle:{color:"#FFF",fontSize:12,letterSpacing:2,fontWeight:"900",marginTop:3},
 track:{flexDirection:"row",alignItems:"center",gap:12,marginTop:28,padding:13,borderRadius:18,backgroundColor:"#FFFFFF0D"},
 cover:{width:48,height:48,borderRadius:14,backgroundColor:"#E34D91",alignItems:"center",justifyContent:"center"},
 title:{color:"#FFF",fontSize:14,fontWeight:"900",textTransform:"capitalize"},artist:{color:"#B9A6BD",fontSize:9,letterSpacing:1,marginTop:5},
 lyrics:{paddingTop:34,paddingBottom:25},small:{color:"#FF8DBB",fontSize:9,letterSpacing:2,fontWeight:"900",marginBottom:17},
 line:{fontSize:22,fontWeight:"900",lineHeight:34,marginBottom:9},active:{color:"#FFF"},inactive:{color:"#806D86"},end:{marginTop:28},
 bottom:{paddingBottom:24},progress:{height:3,backgroundColor:"#49364D",borderRadius:4},progressFill:{width:"28%",height:3,backgroundColor:"#FF75AB",borderRadius:4},
 controls:{flexDirection:"row",alignItems:"center",justifyContent:"center",gap:42,marginTop:18},play:{width:52,height:52,borderRadius:26,backgroundColor:"#FF9CC4",alignItems:"center",justifyContent:"center"},
 note:{color:"#907D96",fontSize:9,textAlign:"center",marginTop:13}
});