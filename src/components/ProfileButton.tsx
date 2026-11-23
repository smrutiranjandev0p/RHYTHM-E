import {Link} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet,TouchableOpacity} from "react-native";

export default function ProfileButton(){
 return (
  <Link href="/profile" asChild>
   <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel="Open your profile"
    activeOpacity={0.7}
    hitSlop={10}
    style={s.button}
   >
    <MaterialCommunityIcons name="account-circle" size={23} color="#FFF"/>
   </TouchableOpacity>
  </Link>
 );
}
const s=StyleSheet.create({
 button:{
  width:44,
  height:44,
  borderRadius:14,
  backgroundColor:"#35243A",
  borderWidth:1,
  borderColor:"#60445F",
  alignItems:"center",
  justifyContent:"center",
  zIndex:100,
  elevation:8
 }
});
