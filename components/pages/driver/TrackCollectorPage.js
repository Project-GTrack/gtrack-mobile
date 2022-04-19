import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Button,
  View,
} from "native-base";
import CollectorIcon from "../../../assets/collector_marker_icon.png"
import * as Location from "expo-location";
import MapView, { Marker ,PROVIDER_GOOGLE} from "react-native-maps";
import { Alert, Dimensions } from "react-native";
import MessageAlert from "../../helpers/MessageAlert";
import { LogBox } from 'react-native';
import Firebase from '../../helpers/Firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
const db = Firebase.app().database();
const TrackCollectorPage = () => {
  const { height, width } = Dimensions.get( 'window' );
  const LATITUDE_DELTA=0.23;
  const [user,setUser]=useState(null);
  const [marginBottom,setMarginBottom]=useState(1);
  const [isDisabled,setIsDisabled] = useState(false);
  const [marker, showMarker] = useState(false);
  const [initLoc, setInitLoc] = useState({
    latitude: 10.4659,
    longitude: 123.9806,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA * (width / height),
  });
  const [alert, setAlert] = useState({
    visible: false,
    message: null,
    colorScheme: null,
    header: null,
  });
  useEffect(() => {
    Alert.alert(
      "Permission",
      "GTrack collects location data to enable  driver/collector tracking during a scheduled waste "+
      "collection even when the app is closed or not in use.",
      [
          {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
          },
          { text: "Continue", onPress: () => console.log("Continue") }
      ]
    );
  }, [])
  
  useEffect(() => {
    LogBox.ignoreLogs(['Setting a timer']);
    getData();
    let interval;
    if(marker){
      interval = setInterval(() => {
        getLiveLocation();
        db.ref('Drivers/'+user.user_id).set({
          active: 1,
          driver_id:user.user_id,
          driver_name:user.fname+" "+user.lname,
          latitude: initLoc.latitude,
          longitude: initLoc.longitude,
          garbage_type:user.userSchedule[0].garbage_type,
          landmark:user.userSchedule[0].landmark,
          barangay:user.userSchedule[0].barangay,
        })  
      }, 6000);
    }
    return () => clearInterval(interval);
  
  },[marker, initLoc])
  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@user');
        if(value!==null){
          var parsed = JSON.parse(value);
          setUser(parsed);
          if(parsed.hasOwnProperty("userSchedule")){
            setIsDisabled(false);
          }else{
            setIsDisabled(true);
              setAlert({
                visible: true,
                message: "You have no schedule today",
                colorScheme: "primary",
                header: "Collection Schedule",
              });
          }
        }else{
            setUser(null);
        }
    }catch (e){
        console.log(e);
    }
  }
  const getLiveLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Linking.openURL("app-settings:");
      return;
    }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, maximumAge: 10000});
      setInitLoc(prevState => ({...prevState,latitude:location.coords.latitude,longitude:location.coords.longitude}))     
     
}
  
  const showLocation = async () => {
      showMarker(true);
  };
  const stopSharing = async() => {
    showMarker(false);
    await db.ref('Drivers/').child(user.user_id).remove();
  };
  return (
    <>

      <View>
      <MessageAlert alert={alert} setAlert={setAlert} />
        <MapView
          // region={initLoc}
          initialRegion={initLoc}
          showsUserLocation={true}
          showsMyLocationButton={true}
          provider={PROVIDER_GOOGLE}
          onMapReady={()=>setMarginBottom(0)}
          style={{
            width: '100%',
            height: '100%',
            marginBottom:marginBottom
          }} 
        >
          {marker ? (<Marker
                  coordinate={{
                    latitude: initLoc.latitude,
                    longitude: initLoc.longitude,
                  }}
                >
                  <Image
                    size={45}
                    resizeMode={"contain"}
                    source={CollectorIcon}
                    alt="Concern Photo"
                    rounded={"full"}
                  />
                </Marker>):(<></>)}
        </MapView>
        {(() => {
          if (!marker) {
            return (
              <Button
                position="absolute"
                right={16}
                top={3}
                colorScheme="success"
                onPress={() => showLocation()}
                isDisabled={isDisabled}
              >
                Share Location
              </Button>
            );
          } else {
            return (
              <Button
                position="absolute"
                right={16}
                top={3}
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
