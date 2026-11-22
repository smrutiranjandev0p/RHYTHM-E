import {Tabs} from "expo-router";
import {MaterialCommunityIcons} from "@expo/vector-icons";
export default function TabLayout(){return <Tabs screenOptions={{headerShown:false,tabBarStyle:{backgroundColor:"#12101B",borderTopColor:"#292235",height:70,paddingTop:8,paddingBottom:10},tabBarActiveTintColor:"#DDA6FF",tabBarInactiveTintColor:"#777184",tabBarLabelStyle:{fontSize:10,fontWeight:"600"}}}>
<Tabs.Screen name="index" options={{title:"Home",tabBarIcon:({color,size})=><MaterialCommunityIcons name="home-variant" color={color} size={size}/>}}/>
<Tabs.Screen name="discover" options={{title:"Discover",tabBarIcon:({color,size})=><MaterialCommunityIcons name="compass-outline" color={color} size={size}/>}}/>
<Tabs.Screen name="library" options={{title:"Library",tabBarIcon:({color,size})=><MaterialCommunityIcons name="music-box-multiple-outline" color={color} size={size}/>}}/>
<Tabs.Screen name="profile" options={{title:"You",tabBarIcon:({color,size})=><MaterialCommunityIcons name="account-circle-outline" color={color} size={size}/>}}/>
</Tabs>}