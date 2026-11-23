import {useRouter} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {StyleSheet,TouchableOpacity} from "react-native";

export default function ProfileButton(){
 const router=useRouter();
 return <TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel="Open your profile"
  activeOpacity={0.7}
  style={s.button}
  onPress={()=>router.push("/profile" as any)}
 >
  <MaterialCommunityIcons name="account-circle" size={23} color="#FFF"/>
 </TouchableOpacity>;
}
const s=StyleSheet.create({button:{width:40,height:40,borderRadius:14,backgroundColor:"#35243A",borderWidth:1,borderColor:"#60445F",alignItems:"center",justifyContent:"center"}});
