import {useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ScrollView,StyleSheet,Text,TouchableOpacity,View,useColorScheme} from "react-native";
import {useAudio} from "../audio/AudioProvider";
import {useAppSettings,getThemePalette} from "../settings/SettingsProvider";

const actions=[
 {title:"My Library",detail:"Your imported tracks and playlists",icon:"music-box-multiple",route:"/(tabs)/library",color:"#C34E7D"},
 {title:"Listening insights",detail:"Listening time, history and music stats",icon:"chart-timeline-variant",route:"/insights",color:"#8D67C4"},
 {title:"Sound Lab",detail:"Sound presets, playback and sleep timer",icon:"tune-variant",route:"/sound-lab",color:"#398B8B"},
 {title:"Lyrics & language",detail:"Find lyrics for the currently playing track",icon:"text-box-multiple-outline",route:"/lyrics/current",color:"#B56B9A"},
 {title:"App experience",detail:"Appearance, haptics and notifications",icon:"palette-outline",route:"/settings",color:"#C47C3B"}
];
export default function ProfileScreen(){
 const router=useRouter();const {tracks,favorites,recentTracks,activeTrack}=useAudio();const {theme}=useAppSettings();const palette=getThemePalette(theme,useColorScheme());
 return <ScrollView style={[s.screen,{backgroundColor:palette.background}]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <View style={s.top}><View><Text style={s.kicker}>YOUR MUSIC UNIVERSE</Text><Text style={s.topTitle}>Profile</Text></View><TouchableOpacity style={s.gear} onPress={()=>router.push("/settings")}><MaterialCommunityIcons name="cog-outline" size={22} color="#FFF"/></TouchableOpacity></View>
  <View style={s.hero}>
   <View style={s.heroGlow}/><View style={s.avatarOuter}><View style={s.avatar}><Text style={s.initial}>E</Text></View><View style={s.spark}><MaterialCommunityIcons name="star-four-points" size={11} color="#291624"/></View></View>
   <Text style={s.title}>Your space.</Text><Text style={s.sub}>Your music. Your mood. Your RHYTHM.</Text>
   <View style={s.member}><MaterialCommunityIcons name="creation" size={13} color="#FFB9D4"/><Text style={s.memberText}>RHYTHM E MEMBER</Text></View>
  </View>
  <View style={s.stats}>
   <View style={s.stat}><Text style={s.statValue}>{tracks.length}</Text><Text style={s.statLabel}>TRACKS</Text></View>
   <View style={s.statLine}/><View style={s.stat}><Text style={s.statValue}>{favorites.length}</Text><Text style={s.statLabel}>FAVOURITES</Text></View>
   <View style={s.statLine}/><View style={s.stat}><Text style={s.statValue}>{recentTracks.length}</Text><Text style={s.statLabel}>RECENT</Text></View>
  </View>
  <View style={s.now}><View style={s.nowIcon}><MaterialCommunityIcons name="music-note" size={19} color="#FFF"/></View><View style={{flex:1}}><Text style={s.nowLabel}>CURRENTLY PLAYING</Text><Text style={s.nowTitle} numberOfLines={1}>{activeTrack?.name||"Nothing playing right now"}</Text><Text style={s.nowArtist} numberOfLines={1}>{activeTrack?.artist||"Pick a track and make it yours"}</Text></View><MaterialCommunityIcons name="waveform" size={22} color="#FF9CC4"/></View>
  <Text style={s.section}>Personalise your experience</Text>
  {actions.map((a,i)=><TouchableOpacity key={a.title} accessibilityRole="button" style={s.action} activeOpacity={0.78} onPress={()=>router.push(a.route as any)}><View style={[s.actionIcon,{backgroundColor:a.color}]}><MaterialCommunityIcons name={a.icon as any} size={21} color="#FFF"/></View><View style={{flex:1}}><Text style={s.actionTitle}>{a.title}</Text><Text style={s.actionDetail}>{a.detail}</Text></View><MaterialCommunityIcons name="chevron-right" size={22} color="#A98EAA"/></TouchableOpacity>)}
  <View style={s.footer}><Text style={s.footerBrand}>RHYTHM E</Text><Text style={s.footerText}>BEYOND LISTENING. BUILT AROUND YOU.</Text><Text style={s.version}>VERSION 1.0 • DEVELOPMENT BUILD</Text></View>
 </ScrollView>
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#160D1C"},content:{padding:21,paddingTop:58,paddingBottom:42},
 top:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},kicker:{color:"#FF9CC4",fontSize:9,letterSpacing:2,fontWeight:"900"},topTitle:{color:palette.text,fontSize:24,fontWeight:"900",marginTop:4},gear:{width:42,height:42,borderRadius:14,backgroundColor:"#35243A",alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"#60445F"},
 hero:{alignItems:"center",paddingVertical:24,marginTop:8,backgroundColor:palette.surface,borderRadius:24,borderWidth:1,borderColor:"#4A3048",overflow:"hidden"},heroGlow:{position:"absolute",width:230,height:230,borderRadius:115,backgroundColor:"#C34E7D",opacity:.17,top:-145},avatarOuter:{width:94,height:94,borderRadius:32,padding:3,backgroundColor:"#FF9CC4",borderWidth:1,borderColor:"#FFE1EE"},avatar:{flex:1,borderRadius:29,backgroundColor:"#4A2846",alignItems:"center",justifyContent:"center",borderWidth:2,borderColor:"#FFFFFF35"},initial:{color:"#FFF0F7",fontSize:46,fontWeight:"900"},spark:{position:"absolute",right:-2,bottom:2,width:25,height:25,borderRadius:13,backgroundColor:"#FFB5D1",alignItems:"center",justifyContent:"center",borderWidth:2,borderColor:"#25192B"},title:{color:palette.text,fontSize:27,fontWeight:"900",marginTop:15},sub:{color:"#CBB5CC",fontSize:11,marginTop:6},member:{flexDirection:"row",alignItems:"center",gap:7,backgroundColor:"#493044",paddingHorizontal:12,paddingVertical:8,borderRadius:18,marginTop:14},memberText:{color:"#FFE2EF",fontSize:8,fontWeight:"900",letterSpacing:1.2},
 stats:{flexDirection:"row",alignItems:"center",justifyContent:"space-around",backgroundColor:palette.surface,borderRadius:17,paddingVertical:15,marginTop:13,borderWidth:1,borderColor:palette.border},stat:{alignItems:"center",flex:1},statValue:{color:palette.text,fontSize:20,fontWeight:"900"},statLabel:{color:palette.muted,fontSize:8,fontWeight:"900",letterSpacing:1,marginTop:4},statLine:{width:1,height:28,backgroundColor:"#49364D"},
 now:{flexDirection:"row",alignItems:"center",gap:11,backgroundColor:palette.surface,padding:13,borderRadius:17,marginTop:13,borderWidth:1,borderColor:palette.border},nowIcon:{width:38,height:38,borderRadius:12,backgroundColor:"#C34E7D",alignItems:"center",justifyContent:"center"},nowLabel:{color:"#FF9CC4",fontSize:8,fontWeight:"900",letterSpacing:1},nowTitle:{color:palette.text,fontSize:11,fontWeight:"900",marginTop:4},nowArtist:{color:palette.muted,fontSize:9,marginTop:3},
 section:{color:palette.text,fontSize:16,fontWeight:"900",marginTop:25,marginBottom:12},action:{flexDirection:"row",alignItems:"center",gap:13,backgroundColor:palette.surface,padding:13,borderRadius:17,marginBottom:10,borderWidth:1,borderColor:palette.border},actionIcon:{width:43,height:43,borderRadius:14,alignItems:"center",justifyContent:"center"},actionTitle:{color:palette.text,fontSize:12,fontWeight:"900"},actionDetail:{color:palette.muted,fontSize:9,marginTop:4},footer:{alignItems:"center",marginTop:22},footerBrand:{color:"#FF9CC4",fontSize:13,letterSpacing:3,fontWeight:"900"},footerText:{color:"#B9A6BD",fontSize:8,letterSpacing:1.2,marginTop:7},version:{color:"#78677D",fontSize:8,letterSpacing:1.3,marginTop:11}
});