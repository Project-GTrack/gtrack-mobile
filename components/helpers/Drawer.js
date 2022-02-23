import React, { useState,useEffect, useRef } from 'react'
import * as Device from 'expo-device';
import CustomDrawerContent from "./CustomDrawerContent";
import Toolbar from './Toolbar';
import { createDrawerNavigator,useDrawerStatus} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications'
import Firebase from '../helpers/Firebase.js';
import { LogBox } from 'react-native';

const database=Firebase.database();
const DrawerPage = createDrawerNavigator();
const Drawer = ({navigation}) => {
    // const notificationListener = useRef();
    const responseListener = useRef();
    const [user,setUser]=useState(null);
    const setFirebaseExpoPushToken=async (token)=>{
        await database.ref(`/PushTokens/${user && user.user_id}`)
        .set({
            user_id: user?user.user_id:'',
            push_token:token
        })
    }
    const registerForPushNotificationsAsync = async () => {
        try {
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync()
                let finalStatus = existingStatus
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync()
                    finalStatus = status
                }
                if (finalStatus !== 'granted') {
                    // throw new Error('Permission not granted!')
                    alert('Failed to get push token for push notification!');
                    return;
                }
                const token = (await Notifications.getExpoPushTokenAsync()).data
                setFirebaseExpoPushToken(token);
            } else {
                alert('Must use physical device for Push Notifications');
            }
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                  name: 'default',
                  importance: Notifications.AndroidImportance.MAX,
                  vibrationPattern: [0, 250, 250, 250],
                  lightColor: '#FF231F7C',
                });
            }
        } catch (error) {
            console.error(error)
        }
    }
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@user');
            if(value!==null){
                setUser(JSON.parse(value));
            }else{
                setUser(null);
            }
        }catch (e){
            console.log(e);
        }
    }
    useEffect(() => {
        LogBox.ignoreLogs(['Setting a timer']);
        getData();
        registerForPushNotificationsAsync();
        // This listener is fired whenever a notification is received while the app is foregrounded
        // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        //     setNotification(notification);
        // });
  
        // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            navigation.navigate('Announcements')
        });
  
        return () => {
            // Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
    
    // useEffect(() => {
    //     registerForPushNotificationsAsync();
    // }, [])
    return (
        <DrawerPage.Navigator
            screenOptions={{
                drawerPosition:'right'
            }}
            drawerContent={(props) => <CustomDrawerContent getData={getData} user={user} {...props}/>}
        >
            <DrawerPage.Screen name="Toolbar" component={Toolbar} options={{headerShown: false}}/>
        </DrawerPage.Navigator>
    )
}

export default Drawer;
