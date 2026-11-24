import {useEffect,useState} from "react";
import {useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useAudio} from "../src/audio/AudioProvider";
import {useAppSettings,getThemePalette} from "../src/settings/SettingsProvider";
import {useAppSettings,getThemePalette} from "../src/settings/SettingsProvider";
import {ScrollView,StyleSheet,Text,TouchableOpacity,View,useColorScheme} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const presets=["REELSONIC Original","REELSONIC Bass","REELSONIC Vocal","REELSONIC Air","Warm","Custom"];
const bands=[{name:"60 Hz",label:"SUB BASS"},{name:"230 Hz",label:"BASS"},{name:"910 Hz",label:"MIDS"},{name:"3.6 kHz",label:"PRESENCE"},{name:"14 kHz",label:"AIR"}];
const timers=["Off","15 min","30 min","45 min","60 min"];
const PREFS_KEY="rhythm-e.sound-lab.v1";
const PREFS_KEY="rhythm-e.sound-lab.v1";
const PREFS_KEY="rhythm-e.sound-lab.v1";

export default function SoundLabScreen(){
 const router=useRouter();
 const {setSleepTimer,cancelSleepTimer,sleepTimerEndsAt}=useAudio();const {theme}=useAppSettings();const palette=getThemePalette(theme,useColorScheme());const {theme}=useAppSettings();const palette=getThemePalette(theme,useColorScheme());
 const [preset,setPreset]=useState("Balanced");
 const [levels,setLevels]=useState([0,0,0,0,0]);
 const [bass,setBass]=useState(false);
 const [normalize,setNormalize]=useState(true);
 const [crossfade,setCrossfade]=useState(false);
 const [timer,setTimer]=useState("Off");
 const [quality,setQuality]=useState("High");
 const [preferencesReady,setPreferencesReady]=useState(false);
 useEffect(()=>{let live=true;AsyncStorage.getItem(PREFS_KEY).then(raw=>{if(!raw||!live)return;try{const saved=JSON.parse(raw);setPreset(typeof saved.preset==="string"?saved.preset:"Balanced");setLevels(Array.isArray(saved.levels)&&saved.levels.length===5?saved.levels.map((v:number)=>Math.max(-6,Math.min(6,Number(v)||0))):[0,0,0,0,0]);setBass(!!saved.bass);setNormalize(saved.normalize!==false);setCrossfade(!!saved.crossfade);setQuality(typeof saved.quality==="string"?saved.quality:"High");}catch{/* Ignore invalid saved preferences. */}}).catch(()=>{}).finally(()=>{if(live)setPreferencesReady(true);});return()=>{live=false;};},[]);
 useEffect(()=>{if(!preferencesReady)return;AsyncStorage.setItem(PREFS_KEY,JSON.stringify({preset,levels,bass,normalize,crossfade,quality})).catch(()=>{});},[preferencesReady,preset,levels,bass,normalize,crossfade,quality]);
 const [preferencesReady,setPreferencesReady]=useState(false);
 useEffect(()=>{let live=true;AsyncStorage.getItem(PREFS_KEY).then(raw=>{if(!raw||!live)return;try{const saved=JSON.parse(raw);setPreset(typeof saved.preset==="string"?saved.preset:"Balanced");setLevels(Array.isArray(saved.levels)&&saved.levels.length===5?saved.levels.map((v:number)=>Math.max(-6,Math.min(6,Number(v)||0))):[0,0,0,0,0]);setBass(!!saved.bass);setNormalize(saved.normalize!==false);setCrossfade(!!saved.crossfade);setQuality(typeof saved.quality==="string"?saved.quality:"High");}catch{/* Ignore invalid saved preferences. */}}).catch(()=>{}).finally(()=>{if(live)setPreferencesReady(true);});return()=>{live=false;};},[]);
 useEffect(()=>{if(!preferencesReady)return;AsyncStorage.setItem(PREFS_KEY,JSON.stringify({preset,levels,bass,normalize,crossfade,quality})).catch(()=>{});},[preferencesReady,preset,levels,bass,normalize,crossfade,quality]);
 const [preferencesReady,setPreferencesReady]=useState(false);
 useEffect(()=>{let live=true;AsyncStorage.getItem(PREFS_KEY).then(raw=>{if(!raw||!live)return;try{const saved=JSON.parse(raw);setPreset(typeof saved.preset==="string"?saved.preset:"Balanced");setLevels(Array.isArray(saved.levels)&&saved.levels.length===5?saved.levels.map((v:number)=>Math.max(-6,Math.min(6,Number(v)||0))):[0,0,0,0,0]);setBass(!!saved.bass);setNormalize(saved.normalize!==false);setCrossfade(!!saved.crossfade);setQuality(typeof saved.quality==="string"?saved.quality:"High");}catch{/* Keep defaults if saved settings are damaged. */}}).catch(()=>{}).finally(()=>{if(live)setPreferencesReady(true);});return()=>{live=false;};},[]);
 useEffect(()=>{if(!preferencesReady)return;AsyncStorage.setItem(PREFS_KEY,JSON.stringify({preset,levels,bass,normalize,crossfade,quality})).catch(()=>{});},[preferencesReady,preset,levels,bass,normalize,crossfade,quality]);
 const change=(index:number,delta:number)=>{setLevels(old=>old.map((v,i)=>i===index?Math.max(-6,Math.min(6,v+delta)):v));setPreset("Custom");};
 const applyPreset=(name:string)=>{setPreset(name);const maps:Record<string,number[]>={"REELSONIC Original":[2,1,0,2,1],"REELSONIC Bass":[4,3,1,0,1],"REELSONIC Vocal":[-2,0,3,3,1],"REELSONIC Air":[-1,-1,0,3,4],Warm:[2,2,1,-1,-1]};setLevels(maps[name]||[0,0,0,0,0]);};
 const Toggle=({label,detail,value,onPress,icon}:{label:string;detail:string;value:boolean;onPress:()=>void;icon:string})=><TouchableOpacity style={s.setting} onPress={onPress}><View style={s.settingIcon}><MaterialCommunityIcons name={icon as any} size={20} color="#FF9CC4"/></View><View style={{flex:1}}><Text style={s.settingTitle}>{label}</Text><Text style={s.settingDetail}>{detail}</Text></View><View style={[s.switch,{backgroundColor:value?"#FF75AB":"#49364D"}]}><View style={[s.knob,{alignSelf:value?"flex-end":"flex-start"}]}/></View></TouchableOpacity>;
 return <ScrollView style={[s.screen,{backgroundColor:palette.background}]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <View style={s.header}><TouchableOpacity style={s.back} onPress={()=>router.back()}><MaterialCommunityIcons name="chevron-left" size={26} color="#FFF"/></TouchableOpacity><View style={{flex:1}}><Text style={s.kicker}>PERSONALISE YOUR SOUND</Text><Text style={s.title}>Sound Lab</Text></View><MaterialCommunityIcons name="tune-variant" size={25} color="#FF9CC4"/></View>
  <View style={s.hero}><View style={s.heroOrb}/><Text style={s.heroKicker}>RHYTHM E • REELSONIC</Text><Text style={s.heroTitle}>Your sound.{ "\n"}Your rules.</Text><Text style={s.heroDesc}>A punchier, clearer listening profile is in development.</Text><View style={s.chip}><MaterialCommunityIcons name="waveform" size={14} color="#FFF"/><Text style={s.chipText}>AUDIO PROFILE</Text></View></View>
  <View style={s.sectionHead}><Text style={s.sectionTitle}>Equalizer</Text><Text style={s.sectionMeta}>5-BAND • UI PREVIEW</Text></View>
  <View style={s.panel}>
   <View style={s.presetWrap}>{presets.map(p=><TouchableOpacity key={p} onPress={()=>applyPreset(p)} style={[s.preset,{backgroundColor:preset===p?"#FF75AB":"#332338"}]}><Text style={[s.presetText,{color:preset===p?"#28111E":"#E6D4E8"}]}>{p}</Text></TouchableOpacity>)}</View>
   {bands.map((b,i)=><View key={b.name} style={s.band}><View style={{width:70}}><Text style={s.bandName}>{b.name}</Text><Text style={s.bandLabel}>{b.label}</Text></View><TouchableOpacity style={s.adjust} onPress={()=>change(i,-1)}><MaterialCommunityIcons name="minus" size={17} color="#FFF"/></TouchableOpacity><View style={s.meter}><View style={s.meterCenter}/><View style={[s.meterFill,{width:(levels[i]+6)/12*100+"%"}]}/></View><TouchableOpacity style={s.adjust} onPress={()=>change(i,1)}><MaterialCommunityIcons name="plus" size={17} color="#FFF"/></TouchableOpacity><Text style={s.value}>{levels[i]>0?"+":""}{levels[i]}</Text></View>)}
   <Text style={s.hint}>Tap + or − to adjust each band. Values range from −6 to +6. Your choices are saved on this device.</Text>
  </View>
  <View style={s.sectionHead}><Text style={s.sectionTitle}>Playback enhancement</Text><Text style={s.sectionMeta}>PERSONAL SETTINGS</Text></View>
  <View style={s.panel}>
   <Toggle label="Bass enhancement" detail="Add extra low-end presence" value={bass} onPress={()=>setBass(!bass)} icon="waveform"/>
   <View style={s.separator}/><Toggle label="Volume normalisation" detail="Keep playback levels consistent" value={normalize} onPress={()=>setNormalize(!normalize)} icon="volume-high"/>
   <View style={s.separator}/><Toggle label="Smooth crossfade" detail="Blend the end of one track into the next" value={crossfade} onPress={()=>setCrossfade(!crossfade)} icon="swap-horizontal"/>
  </View>
  <View style={s.sectionHead}><Text style={s.sectionTitle}>Listening preferences</Text></View>
  <View style={s.panel}>
   <Text style={s.optionTitle}>Streaming quality preference</Text><View style={s.optionRow}>{["Data saver","Normal","High","Lossless"].map(q=><TouchableOpacity key={q} onPress={()=>setQuality(q)} style={[s.quality,{backgroundColor:quality===q?"#FF75AB":"#332338"}]}><Text style={[s.qualityText,{color:quality===q?"#28111E":"#E6D4E8"}]}>{q}</Text></TouchableOpacity>)}</View>
   <View style={s.separator}/><Text style={s.optionTitle}>Sleep timer</Text><View style={s.optionRow}>{timers.map(t=><TouchableOpacity key={t} onPress={()=>{setTimer(t);if(t==="Off")cancelSleepTimer();else setSleepTimer(Number.parseInt(t,10));}} style={[s.timer,{backgroundColor:timer===t?"#FF75AB":"#332338"}]}><Text style={[s.qualityText,{color:timer===t?"#28111E":"#E6D4E8"}]}>{t}</Text></TouchableOpacity>)}</View>
  </View>
  {sleepTimerEndsAt&&<Text style={s.hint}>Sleep timer active — playback will pause automatically.</Text>}
  <View style={s.notice}><MaterialCommunityIcons name="information-outline" size={17} color="#FF9CC4"/><Text style={s.noticeText}>Your Sound Lab preferences are saved on this device and restored when the app restarts. Important: the EQ bands, bass enhancement, volume normalisation, crossfade and quality choices are currently preference/preview controls; they do not yet process the audio signal. A native audio-processing pipeline and a licensed streaming provider are required before those features can truthfully be marked active. The sleep timer is functional and pauses local playback at the selected time.</Text></View>
  <View style={{height:28}}/>
 </ScrollView>
}
const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:"#160D1C"},content:{padding:21,paddingTop:56,paddingBottom:24},
 header:{flexDirection:"row",alignItems:"center",gap:13},back:{width:42,height:42,borderRadius:14,backgroundColor:palette.surfaceAlt,alignItems:"center",justifyContent:"center"},
 kicker:{color:"#FF9CC4",fontSize:9,letterSpacing:1.8,fontWeight:"900"},title:{color:palette.text,fontSize:27,fontWeight:"900",marginTop:3},
 hero:{marginTop:23,height:174,borderRadius:23,backgroundColor:"#873E78",padding:19,justifyContent:"center",overflow:"hidden"},heroOrb:{position:"absolute",width:180,height:180,borderRadius:90,backgroundColor:"#F58BB0",right:-45,top:-60,opacity:.65},
 heroKicker:{color:"#FFE0ED",fontSize:9,letterSpacing:1.5,fontWeight:"900"},heroTitle:{color:palette.text,fontSize:27,lineHeight:29,fontWeight:"900",marginTop:8},heroDesc:{color:"#FFE4F0",fontSize:10,marginTop:6},chip:{position:"absolute",right:15,bottom:15,flexDirection:"row",gap:6,alignItems:"center",backgroundColor:"#FFFFFF25",paddingHorizontal:10,paddingVertical:7,borderRadius:20},chipText:{color:palette.text,fontSize:8,fontWeight:"900",letterSpacing:1},
 sectionHead:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:26,marginBottom:12},sectionTitle:{color:palette.text,fontSize:17,fontWeight:"900"},sectionMeta:{color:palette.muted,fontSize:8,letterSpacing:1.2,fontWeight:"800"},
 panel:{backgroundColor:palette.surface,borderRadius:20,padding:15,borderWidth:1,borderColor:palette.border},presetWrap:{flexDirection:"row",flexWrap:"wrap",gap:7,marginBottom:17},preset:{paddingHorizontal:12,paddingVertical:9,borderRadius:18},presetText:{fontSize:10,fontWeight:"800"},
 band:{flexDirection:"row",alignItems:"center",gap:7,marginBottom:15},bandName:{color:palette.text,fontSize:10,fontWeight:"800"},bandLabel:{color:palette.muted,fontSize:7,letterSpacing:1,marginTop:3},adjust:{width:27,height:27,borderRadius:9,backgroundColor:"#49364D",alignItems:"center",justifyContent:"center"},meter:{height:7,flex:1,backgroundColor:"#49364D",borderRadius:6,overflow:"hidden",justifyContent:"center"},meterCenter:{position:"absolute",left:"50%",height:12,width:1,backgroundColor:"#B99DBB",zIndex:2},meterFill:{height:7,backgroundColor:"#FF75AB",borderRadius:6},value:{color:palette.text,fontSize:10,fontWeight:"800",width:23,textAlign:"right"},hint:{color:palette.muted,fontSize:9,marginTop:1},
 setting:{flexDirection:"row",alignItems:"center",gap:12,paddingVertical:11},settingIcon:{width:36,height:36,borderRadius:12,backgroundColor:"#493044",alignItems:"center",justifyContent:"center"},settingTitle:{color:palette.text,fontSize:12,fontWeight:"800"},settingDetail:{color:palette.muted,fontSize:9,marginTop:4},switch:{width:39,height:23,borderRadius:14,padding:3,justifyContent:"center"},knob:{width:17,height:17,borderRadius:9,backgroundColor:"#FFF"},separator:{height:1,backgroundColor:"#49364D"},
 optionTitle:{color:palette.text,fontSize:11,fontWeight:"800",marginBottom:11,marginTop:3},optionRow:{flexDirection:"row",flexWrap:"wrap",gap:7,marginBottom:15},quality:{paddingHorizontal:11,paddingVertical:9,borderRadius:13},qualityText:{fontSize:9,fontWeight:"800"},timer:{paddingHorizontal:11,paddingVertical:9,borderRadius:13},
 notice:{flexDirection:"row",gap:10,alignItems:"flex-start",backgroundColor:palette.surfaceAlt,padding:13,borderRadius:14,marginTop:18},noticeText:{color:palette.muted,fontSize:9,lineHeight:15,flex:1}
});