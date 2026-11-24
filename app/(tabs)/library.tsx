import {useState} from "react";
import {useColorScheme} from "react-native";
import {useAppSettings,getThemePalette} from "../../src/settings/SettingsProvider";
import {useRouter} from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {ActivityIndicator,Alert,Modal,ScrollView,StyleSheet,Text,TextInput,TouchableOpacity,View} from "react-native";
import {useAudio} from "../../src/audio/AudioProvider";
import type {LocalTrack} from "../../src/audio/AudioProvider";
import {copyImportedAudioToLibrary} from "../../src/audio/libraryStorage";
import ProfileButton from "../../src/components/ProfileButton";

export default function LibraryScreen(){
 const {theme}=useAppSettings();const p=getThemePalette(theme,useColorScheme());
 const router=useRouter();
 const {tracks,activeIndex,playTrack,status,addTracks,favorites,updateTrack}=useAudio();
 const [loading,setLoading]=useState(false);
 const [editing,setEditing]=useState<LocalTrack|null>(null);
 const [editName,setEditName]=useState("");
 const [editArtist,setEditArtist]=useState("");
 const [editAlbum,setEditAlbum]=useState("");
 const [editError,setEditError]=useState("");

 const importAudio=async()=>{
  try{
   setLoading(true);
   const result=await DocumentPicker.getDocumentAsync({type:"audio/*",multiple:true,copyToCacheDirectory:true});
   if(result.canceled)return;
   const imported:LocalTrack[]=[];
   for(let index=0;index<result.assets.length;index++){
    const asset=result.assets[index];
    const already=tracks.some(track=>track.uri===asset.uri||track.name===asset.name);
    if(already)continue;
    const id="local:"+Date.now()+"-"+index;
    const uri=await copyImportedAudioToLibrary(asset.uri,id,asset.name);
    imported.push({id,name:asset.name.replace(/\.[^/.]+$/,""),uri,artist:"Unknown artist",source:"Local"});
   }
   if(imported.length){addTracks(imported);Alert.alert("Saved to your library",imported.length+" audio file(s) copied into RHYTHM E storage.");}
   else Alert.alert("Already in your library","Those files appear to have already been imported.");
  }catch(e){Alert.alert("Import failed",e instanceof Error?e.message:"Please try selecting the audio file again.");}
  finally{setLoading(false);}
 };
 const openEditor=(track:LocalTrack)=>{
  setEditing(track);setEditName(track.name);setEditArtist(track.artist);setEditAlbum(track.album||"");setEditError("");
 };
 const saveMetadata=()=>{
  if(!editing)return;
  if(!editName.trim()||!editArtist.trim()){setEditError("Track title and artist are required.");return;}
  updateTrack(editing.id,{name:editName.trim(),artist:editArtist.trim(),album:editAlbum.trim()||undefined});
  setEditing(null);
 };
 const renderTrack=(track:LocalTrack,index:number,prefix="")=><View key={prefix+track.id} style={s.track}>
  <TouchableOpacity style={[s.cover,{backgroundColor:["#C34E7D","#7255A5","#397E79","#D47A35"][index%4]}]} onPress={()=>{playTrack(tracks.findIndex(item=>item.id===track.id));router.push("/player/local");}}><MaterialCommunityIcons name="music-note" size={24} color="#FFF"/></TouchableOpacity>
  <TouchableOpacity style={{flex:1}} onPress={()=>{playTrack(tracks.findIndex(item=>item.id===track.id));router.push("/player/local");}}>
   <Text style={[s.trackTitle,{color:p.text}]} numberOfLines={1}>{track.name}</Text><Text style={[s.trackArtist,{color:p.muted}]}>{track.artist}{track.album?" · "+track.album:""}</Text>
  </TouchableOpacity>
  <TouchableOpacity style={s.editButton} onPress={()=>openEditor(track)}><MaterialCommunityIcons name="pencil-outline" size={18} color="#FF9CC4"/></TouchableOpacity>
  {activeIndex===tracks.findIndex(item=>item.id===track.id)&&status.playing?<MaterialCommunityIcons name="volume-high" size={20} color="#FF9CC4"/>:<TouchableOpacity onPress={()=>{playTrack(tracks.findIndex(item=>item.id===track.id));router.push("/player/local");}}><MaterialCommunityIcons name="play-circle-outline" size={24} color="#FFF"/></TouchableOpacity>}
 </View>;

 return <>
 <ScrollView style={[s.screen,{backgroundColor:p.background}]} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
  <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}><Text style={[s.kicker,{color:p.accent}]}>YOUR COLLECTION</Text><ProfileButton/></View><Text style={[s.title,{color:p.text}]}>Library</Text><Text style={[s.sub,{color:p.muted}]}>Your music, saved on this device.</Text>
  <TouchableOpacity style={s.importCard} onPress={importAudio} disabled={loading}><View style={s.importIcon}><MaterialCommunityIcons name="folder-music" size={28} color="#FFF"/></View><View style={{flex:1}}><Text style={s.importTitle}>{loading?"Copying music into your library…":"Import music from your phone"}</Text><Text style={s.importSub}>Imported audio is copied to RHYTHM E's private app storage</Text></View>{loading?<ActivityIndicator color="#FFF"/>:<MaterialCommunityIcons name="plus-circle" size={25} color="#FFF"/>}</TouchableOpacity>
  <View style={s.section}><Text style={[s.sectionTitle,{color:p.text}]}>Your tracks</Text><Text style={[s.count,{color:p.muted}]}>{tracks.length} TRACKS</Text></View>
  {tracks.length===0?<View style={[s.empty,{backgroundColor:p.surface}]}><MaterialCommunityIcons name="music-box-multiple-outline" size={43} color="#FF9CC4"/><Text style={[s.emptyTitle,{color:p.text}]}>Your music lives here.</Text><Text style={[s.emptyBody,{color:p.muted}]}>Import audio files to keep a private copy inside RHYTHM E.</Text></View>:tracks.map((track,index)=>renderTrack(track,index))}
  <View style={s.section}><Text style={[s.sectionTitle,{color:p.text}]}>Artists</Text><Text style={[s.count,{color:p.muted}]}>{new Set(tracks.map(t=>t.artist||"Unknown artist")).size} ARTISTS</Text></View>
  <View style={s.browseGrid}>{Array.from(new Set(tracks.map(t=>t.artist||"Unknown artist"))).map(artist=><TouchableOpacity key={artist} style={[s.browseCard,{backgroundColor:p.surface,borderColor:p.border}]} onPress={()=>router.push({pathname:"/artist/[name]",params:{name:artist}})}><View style={s.browseIcon}><MaterialCommunityIcons name="account-music" size={21} color="#FFF"/></View><Text style={[s.browseTitle,{color:p.text}]} numberOfLines={1}>{artist}</Text><Text style={[s.browseSub,{color:p.muted}]}>View artist</Text></TouchableOpacity>)}</View>
  <View style={s.section}><Text style={[s.sectionTitle,{color:p.text}]}>Albums</Text><Text style={[s.count,{color:p.muted}]}>{new Set(tracks.map(t=>t.album||"Singles")).size} ALBUMS</Text></View>
  <View style={s.browseGrid}>{Array.from(new Set(tracks.map(t=>t.album||"Singles"))).map(album=><TouchableOpacity key={album} style={[s.browseCard,{backgroundColor:p.surface,borderColor:p.border}]} onPress={()=>router.push({pathname:"/album/[name]",params:{name:album}})}><View style={[s.browseIcon,{backgroundColor:"#397E79"}]}><MaterialCommunityIcons name="album" size={21} color="#FFF"/></View><Text style={[s.browseTitle,{color:p.text}]} numberOfLines={1}>{album}</Text><Text style={[s.browseSub,{color:p.muted}]}>Open album</Text></TouchableOpacity>)}</View>
  <View style={s.section}><Text style={[s.sectionTitle,{color:p.text}]}>Your favourites</Text><Text style={[s.count,{color:p.muted}]}>{favorites.length} SAVED</Text></View>
  {tracks.filter(track=>favorites.includes(track.id)).length===0?<Text style={[s.emptyBody,{color:p.muted}]}>Tap the heart in Flow or Player to save tracks here.</Text>:tracks.filter(track=>favorites.includes(track.id)).map((track,index)=>renderTrack(track,index,"fav-"))}
  <View style={[s.note,{backgroundColor:p.surface}]}><MaterialCommunityIcons name="shield-check-outline" size={16} color="#FF9CC4"/><Text style={[s.noteText,{color:p.muted}]}>Your imported audio stays inside this app's private storage. RHYTHM E does not upload your music.</Text></View>
  <View style={{height:25}}/>
 </ScrollView>
 <Modal visible={!!editing} transparent animationType="slide" onRequestClose={()=>setEditing(null)}>
  <View style={s.modalBackdrop}><View style={[s.modalCard,{backgroundColor:p.surface,borderColor:p.border}]}>
   <View style={s.modalHead}><Text style={[s.modalTitle,{color:p.text}]}>Edit track details</Text><TouchableOpacity onPress={()=>setEditing(null)}><MaterialCommunityIcons name="close" size={23} color="#FFF"/></TouchableOpacity></View>
   <Text style={s.fieldLabel}>TRACK TITLE</Text><TextInput value={editName} onChangeText={setEditName} placeholder="Track title" placeholderTextColor="#8F7D95" style={[s.field,{backgroundColor:p.surfaceAlt,color:p.text,borderColor:p.border}]}/>
   <Text style={s.fieldLabel}>ARTIST</Text><TextInput value={editArtist} onChangeText={setEditArtist} placeholder="Artist name" placeholderTextColor="#8F7D95" style={[s.field,{backgroundColor:p.surfaceAlt,color:p.text,borderColor:p.border}]}/>
   <Text style={s.fieldLabel}>ALBUM</Text><TextInput value={editAlbum} onChangeText={setEditAlbum} placeholder="Album name (optional)" placeholderTextColor="#8F7D95" style={[s.field,{backgroundColor:p.surfaceAlt,color:p.text,borderColor:p.border}]}/>
   {!!editError&&<Text style={s.editError}>{editError}</Text>}
   <TouchableOpacity style={s.saveButton} onPress={saveMetadata}><Text style={s.saveText}>SAVE DETAILS</Text></TouchableOpacity>
  </View></View>
 </Modal>
 </>
}
const s=StyleSheet.create({screen:{flex:1,backgroundColor:"#160D1C"},content:{padding:22,paddingTop:62,paddingBottom:170},kicker:{color:"#FF9CC4",fontSize:10,letterSpacing:2,fontWeight:"900"},title:{color:"#FFF",fontSize:34,fontWeight:"900",marginTop:8},sub:{color:"#B9A6BD",fontSize:12,marginTop:6},importCard:{marginTop:25,backgroundColor:"#C34E7D",borderRadius:20,padding:16,flexDirection:"row",alignItems:"center",gap:13},importIcon:{width:48,height:48,borderRadius:15,backgroundColor:"#FFFFFF25",alignItems:"center",justifyContent:"center"},importTitle:{color:"#FFF",fontSize:12,fontWeight:"900"},importSub:{color:"#FFE2EF",fontSize:9,marginTop:5},section:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:29,marginBottom:13},sectionTitle:{color:"#FFF",fontSize:17,fontWeight:"900"},count:{color:"#A98EAA",fontSize:8,letterSpacing:1,fontWeight:"900"},empty:{alignItems:"center",backgroundColor:"#25192B",borderRadius:20,padding:25,marginTop:5},emptyTitle:{color:"#FFF",fontSize:17,fontWeight:"900",marginTop:15},emptyBody:{color:"#B9A6BD",fontSize:11,lineHeight:18,textAlign:"center",marginTop:8},track:{flexDirection:"row",alignItems:"center",gap:10,paddingVertical:9},editButton:{padding:6},cover:{width:49,height:49,borderRadius:14,alignItems:"center",justifyContent:"center"},trackTitle:{color:"#FFF",fontSize:12,fontWeight:"800"},trackArtist:{color:"#A98EAA",fontSize:9,marginTop:4},browseGrid:{flexDirection:"row",flexWrap:"wrap",gap:10},browseCard:{width:"48%",backgroundColor:"#25192B",padding:12,borderRadius:16,borderWidth:1,borderColor:"#3B293F"},browseIcon:{width:38,height:38,borderRadius:12,backgroundColor:"#C34E7D",alignItems:"center",justifyContent:"center"},browseTitle:{color:"#FFF",fontSize:10,fontWeight:"900",marginTop:9},browseSub:{color:"#A98EAA",fontSize:8,marginTop:4},note:{flexDirection:"row",gap:9,alignItems:"center",backgroundColor:"#25192B",padding:13,borderRadius:14,marginTop:20},noteText:{color:"#B9A6BD",fontSize:9,lineHeight:14,flex:1},modalBackdrop:{flex:1,backgroundColor:"#000000B8",justifyContent:"flex-end"},modalCard:{backgroundColor:"#25192B",borderTopLeftRadius:25,borderTopRightRadius:25,padding:22,paddingBottom:35,borderWidth:1,borderColor:"#49364D"},modalHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:20},modalTitle:{color:"#FFF",fontSize:19,fontWeight:"900"},fieldLabel:{color:"#FF9CC4",fontSize:9,fontWeight:"900",letterSpacing:1.3,marginTop:12,marginBottom:7},field:{backgroundColor:"#160D1C",borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:"#FFF",fontSize:13,borderWidth:1,borderColor:"#49364D"},editError:{color:"#FF9B9B",fontSize:10,marginTop:10},saveButton:{backgroundColor:"#FF9CC4",borderRadius:14,padding:15,alignItems:"center",marginTop:20},saveText:{color:"#26111D",fontSize:11,fontWeight:"900",letterSpacing:1}});
