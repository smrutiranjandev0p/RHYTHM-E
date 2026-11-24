import React,{createContext,useContext,useEffect,useMemo,useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Appearance,Platform} from "react-native";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

export type AppTheme="Dark"|"AMOLED"|"Light"|"System";
type Preferences={theme:AppTheme;haptics:boolean;notifications:boolean};
type SettingsContextValue=Preferences&{ready:boolean;setTheme:(theme:AppTheme)=>Promise<void>;setHaptics:(enabled:boolean)=>Promise<void>;setNotifications:(enabled:boolean)=>Promise<void>;tapFeedback:()=>void};
const KEY="rhythm-e.preferences.v1";
const defaults:Preferences={theme:"Dark",haptics:true,notifications:false};
const Context=createContext<SettingsContextValue|null>(null);

Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:false,shouldSetBadge:false})});

async function scheduleReminder(){
 if(Platform.OS==="android") await Notifications.setNotificationChannelAsync("listening-reminders",{name:"Listening reminders",importance:Notifications.AndroidImportance.DEFAULT,sound:null});
 let permission=await Notifications.getPermissionsAsync();
 if(!permission.granted) permission=await Notifications.requestPermissionsAsync();
 if(!permission.granted) throw new Error("Notification permission was not granted.");
 await Notifications.cancelAllScheduledNotificationsAsync();
 await Notifications.scheduleNotificationAsync({content:{title:"Your RHYTHM E moment",body:"Take a moment for the music you love.",sound:false},trigger:{type:Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,seconds:86400,repeats:true,channelId:Platform.OS==="android"?"listening-reminders":undefined}});
}
export function SettingsProvider({children}:{children:React.ReactNode}){
 const [prefs,setPrefs]=useState<Preferences>(defaults);const [ready,setReady]=useState(false);
 useEffect(()=>{let live=true;AsyncStorage.getItem(KEY).then(raw=>{if(raw&&live){const saved=JSON.parse(raw) as Partial<Preferences>;setPrefs({...defaults,...saved});}}).catch(()=>{}).finally(()=>{if(live)setReady(true);});return()=>{live=false;};},[]);
 useEffect(()=>{if(!ready)return;AsyncStorage.setItem(KEY,JSON.stringify(prefs)).catch(()=>{});},[prefs,ready]);
 useEffect(()=>{
  // React Native expects null to follow the device setting; "unspecified" is not a valid color scheme.
  const scheme=prefs.theme==="System"?null:prefs.theme==="Light"?"light":"dark";
  try{Appearance.setColorScheme(scheme);}catch(error){console.warn("RHYTHM E could not apply appearance preference",error);}
 },[prefs.theme]);
 const setTheme=async(theme:AppTheme)=>setPrefs(p=>({...p,theme}));
 const setHaptics=async(enabled:boolean)=>setPrefs(p=>({...p,haptics:enabled}));
 const setNotifications=async(enabled:boolean)=>{
  if(enabled){await scheduleReminder();setPrefs(p=>({...p,notifications:true}));}
  else {await Notifications.cancelAllScheduledNotificationsAsync();setPrefs(p=>({...p,notifications:false}));}
 };
 const tapFeedback=()=>{if(prefs.haptics)void Haptics.selectionAsync().catch(()=>{});};
 const value=useMemo(()=>({...prefs,ready,setTheme,setHaptics,setNotifications,tapFeedback}),[prefs,ready]);
 return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useAppSettings(){const value=useContext(Context);if(!value)throw new Error("useAppSettings must be used inside SettingsProvider");return value;}
