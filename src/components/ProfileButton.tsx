import {Link} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet,Text,TouchableOpacity,View} from "react-native";

export default function ProfileButton(){
 return (
  <Link href="/profile" asChild>
   <TouchableOpacity accessibilityRole="button" accessibilityLabel="Open your profile" activeOpacity={0.82} hitSlop={10} style={s.button}>
    <View style={s.ring}><View style={s.avatar}><Text style={s.initial}>E</Text></View></View>
    <View style={s.online}><MaterialCommunityIcons name="check" size={8} color="#160D1C"/></View>
   </TouchableOpacity>
  </Link>
 );
}
const s=StyleSheet.create({
 button:{width:46,height:46,alignItems:"center",justifyContent:"center",position:"relative"},
 ring:{width:43,height:43,borderRadius:16,padding:2,backgroundColor:"#FF9CC4",borderWidth:1,borderColor:"#FFD5E7",alignItems:"center",justifyContent:"center",elevation:8},
 avatar:{width:37,height:37,borderRadius:13,backgroundColor:"#3A2038",alignItems:"center",justifyContent:"center",borderWidth:1,borderColor:"#FFFFFF55"},
 initial:{color:"#FFE7F1",fontSize:20,fontWeight:"900",letterSpacing:-1},
 online:{position:"absolute",right:0,bottom:0,width:14,height:14,borderRadius:7,backgroundColor:"#9DE6C2",borderWidth:2,borderColor:"#160D1C",alignItems:"center",justifyContent:"center"}
});