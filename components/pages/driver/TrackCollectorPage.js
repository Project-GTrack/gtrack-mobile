import React,{useEffect, useState} from 'react'
import {
    Text,
    Image,
    Button,
    Center,
    Input,
    Divider,
    Link,
    Box,
    Stack
  } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"
import GtrackMainLogo from '../../../assets/gtrack-logo-1.png'
import GoogleIcon from '../../../assets/google-icon.png'
import * as Location from 'expo-location';
import MapView,{Marker} from 'react-native-maps';
import { Dimensions } from 'react-native';


const TrackCollectorPage = () => {
    const [initLoc,setInitLoc]=useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421})
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Linking.openURL('app-settings:');
              return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, maximumAge: 10000});
            console.log(location);
            setInitLoc(prevState=>({...prevState,latitude:location.coords.latitude,longitude:location.coords.longitude}))
            // Geolocation.getCurrentPosition(
            //     (position) => {
            //       setInitLoc(prevState=>({...prevState,latitude:position.coords.latitude,longitude:position.coords.longitude}))
            //     },
            //     (error) => {
            //       // See error code charts below.
            //       console.log(error.code, error.message);
            //     },
            //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            // );
          })();
    }, [])
    return (
        <>
        <Center
        style={{
            alignSelf:'stretch'
        }}
        >
            <MapView
            region={initLoc}
            style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
            }} >
            <Marker
                coordinate={{ latitude : initLoc.latitude , longitude : initLoc.longitude }}
                />
            </MapView>
        </Center>
        </>
    )
}

export default TrackCollectorPage
