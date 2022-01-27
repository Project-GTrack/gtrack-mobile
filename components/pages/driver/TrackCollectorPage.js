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
      await Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 300,
        distanceInterval: 0
      }, (res) => {
        setInitLoc((prevState) => ({
          ...prevState,
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
        }));
        console.log(initLoc);
        const db = getDatabase();
        const reference = ref(db, 'drivers/-MNcqKz5vxf-VIbMVxmE');
        set(reference, {
          active: 1,
          driver_id: 2,
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
          route: "Poblacion",
        })
      })
    })();
  }, []);
  const showLocation = () => {
    
    const db = getDatabase();
    const reference = ref(db, 'drivers/-MNcqKz5vxf-VIbMVxmE');
    onValue(reference, (snapshot) => {
      const updateLocation = snapshot.val();
    })
    showMarker(true);
  };
  const stopSharing = () => {
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
