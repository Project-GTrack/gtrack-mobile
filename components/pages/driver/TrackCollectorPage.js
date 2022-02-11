import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  Button,
  Center,
  Input,
  Divider,
  Link,
  Box,
  Stack,
  View,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import GtrackMainLogo from "../../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../../assets/google-icon.png";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Dimensions } from "react-native";
import { getDatabase, ref, onValue, set } from 'firebase/database';
import Firebase from '../../helpers/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
const db = Firebase.app().database();
const TrackCollectorPage = () => {
  const [user,setUser]=useState(null);
  const [sched,setSched]=useState(null);
  const [watch,setWatch] = useState(null);
  const [marker, showMarker] = useState(false);
  const [initLoc, setInitLoc] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
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
  const getSched = async () => {
    try {
        const value = await AsyncStorage.getItem('@schedule');
        if(value!==null){
            setSched(JSON.parse(value));
        }else{
          setSched(null);
        }
    }catch (e){
        console.log(e);
    }
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Linking.openURL("app-settings:");
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, maximumAge: 10000});
      setInitLoc(prevState=>({...prevState,latitude:location.coords.latitude,longitude:location.coords.longitude}))
      getData();
      getSched();
      if(marker){
        try{
          var temp = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 300,
            distanceInterval: 0
          }, (res) => {
            console.log(res);
            db.ref('Drivers/'+user.user_id).set({
                active: 1,
                driver_id:user.user_id,
                latitude: res.coords.latitude,
                longitude: res.coords.longitude,
                landmark:sched.landmark || "",
                barangay:sched.barangay || ""
              })
            setInitLoc(prevState=>({...prevState,latitude:res.coords.latitude,longitude:res.coords.longitude}))
          })
          setWatch(temp);
        }catch(e){
          console.log(e);
        }
      }
    })();
  }, [marker]);
  
  const showLocation = async () => {
    showMarker(true);
  };
  const stopSharing = () => {
    db.ref('Drivers/'+user.user_id).remove();
    watch.remove();
    showMarker(false);
  };
  return (
    <>
      <View>
        <MapView
          region={initLoc}
          style={{
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
          }}
        >
          {(() => {
            if (marker === true) {
              console.log(initLoc);
              return (
                
                <Marker
                  coordinate={{
                    latitude: initLoc.latitude,
                    longitude: initLoc.longitude,
                  }}
                />
              );
            } else {
              return null;
            }
          })()}
        </MapView>
        {(() => {
          if (marker === false) {
            return (
              <Button
                position="absolute"
                right={5}
                top={5}
                colorScheme="success"
                onPress={() => showLocation()}
              >
                Share Location
              </Button>
            );
          } else {
            return (
              <Button
                position="absolute"
                right={5}
                top={5}
                colorScheme="danger"
                onPress={() => stopSharing()}
              >
                Stop Sharing
              </Button>
            );
          }
        })()}
      </View>
    </>
  );
};

export default TrackCollectorPage;
