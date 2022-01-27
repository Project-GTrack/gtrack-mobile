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


const TrackCollectorPage = () => {
  
  let location;
  const [marker, showMarker] = useState(false);
  const [initLoc, setInitLoc] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Linking.openURL("app-settings:");
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
  }, []);
  const showLocation = () => {
    location = Location.watchPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 300,
      distanceInterval: 0
    }, (res) => {
      console.log(res);
      const db = getDatabase();
      const reference = ref(db, 'drivers/-MNcqKz5vxf-VIbMVxmE');
      set(reference, {
        active: 1,
        driver_id: 2,
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        route: "Poblacion",
      })
      setInitLoc(prevState=>({...prevState,latitude:res.coords.latitude,longitude:res.coords.longitude}))
    })
    console.log(initLoc);
    console.log(location);
    const db = getDatabase();
    const reference = ref(db, 'drivers/-MNcqKz5vxf-VIbMVxmE');
    onValue(reference, (snapshot) => {
      const updateLocation = snapshot.val();
    })
    showMarker(true);
  };
  const stopSharing = () => {
    location?.remove();
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
