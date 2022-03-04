import React,{useEffect, useState, useCallback} from 'react'
import {
    Text,
    Center,
    Icon,
    HStack
  } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"
import { Linking, View } from 'react-native';
import * as Location from 'expo-location';
import MapView,{Marker,Callout,PROVIDER_GOOGLE} from 'react-native-maps';
import { Dimensions } from 'react-native';
import Firebase from '../helpers/Firebase.js';
import { LogBox } from 'react-native';
import DumpsterMarker from '../../assets/dumpster_marker_icon.png';
import DumpsterComplete from '../../assets/dumpster_complete_icon.png'
const database=Firebase.database();
const TrackCollectorPage = () => {
    const { height, width } = Dimensions.get( 'window' );
    const LATITUDE_DELTA=0.23;
    const [marginBottom,setMarginBottom]=useState(1);
    const [initLoc,setInitLoc]=useState({
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA * (width / height)});
    const [drivers,setDrivers]=useState(null);
    const [dumpsters,setDumpsters]=useState(null);
    const getFirebaseDrivers = () => {
        database.ref(`Drivers/`).on('value', function (snapshot) {
            if(snapshot.val()){
                var snap=snapshot.val();
                var temp=Object.keys(snap).map((key) => snap[key]);
                setDrivers(temp);
            }
        });
     }
     const getFirebaseDumpsters = () => {
        database.ref(`Dumpsters/`).on('value', function (snapshot) {
            if(snapshot.val()){
                var snap=snapshot.val();
                var temp=Object.keys(snap).map((key) => snap[key]);
                setDumpsters(temp);
            }
        });
     }
    useEffect(() => {
        LogBox.ignoreLogs(['Setting a timer']);
        getFirebaseDrivers();
        getFirebaseDumpsters();
    }, []);
    // const _onMapReady = useCallback(async () => {
    //     let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             Linking.openURL('app-settings:');
    //           return;
    //     }
    //     let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, maximumAge: 10000});
    //     setInitLoc(prevState=>({...prevState,latitude:location.coords.latitude,longitude:location.coords.longitude}))
    // }, [initLoc]);
    // useEffect(() => {
    //     _onMapReady();
    // }, [_onMapReady])
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Linking.openURL('app-settings:');
              return;
            }
            let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, maximumAge: 10000});
            setInitLoc(prevState=>({...prevState,latitude:location.coords.latitude,longitude:location.coords.longitude}))
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
            // region={initLoc}
            showsUserLocation={true}
            showsMyLocationButton={true}
            provider={PROVIDER_GOOGLE}
            onMapReady={()=>setMarginBottom(0)}
            style={{
                width: '100%',
                height: '100%',
                marginBottom:marginBottom
            }} >
                {drivers && drivers.map((value,i)=>{
                    return (
                        <Marker 
                            key={i} 
                            coordinate={{ latitude : value.latitude , longitude : value.longitude }}
                            image={require('../../assets/collector_marker_icon.png')}
                        >
                            <Callout >
                                <View style={{padding:3}}>
                                    <Center>
                                        <Text fontSize={18}>Garbage Collection:</Text>
                                    </Center>
                                    <HStack space={3}>
                                        <Icon
                                            as={<MaterialIcons name="directions" />}
                                            color={"#10b981"}
                                            size={25}
                                        />
                                        <Text fontSize={16}>{value.landmark}</Text>
                                    </HStack>
                                    <HStack space={3}>
                                        <Icon
                                            as={<MaterialIcons name="info" />}
                                            color={"#10b981"}
                                            size={25}
                                        />
                                        <Text fontSize={16}>{value.barangay}</Text>
                                    </HStack>
                                    <HStack space={3}>
                                        <Icon
                                            as={<MaterialIcons name="person" />}
                                            color={"#10b981"}
                                            size={25}
                                        />
                                        <Text fontSize={16}>{value.driver_name}</Text>
                                    </HStack>
                                    <HStack space={3}>
                                        <Icon
                                            as={<MaterialIcons name="delete" />}
                                            color={"#10b981"}
                                            size={25}
                                        />
                                        <Text fontSize={16}>{value.garbage_type}</Text>
                                    </HStack>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
                {dumpsters && dumpsters.map((value,i)=>{
                    return (

                        <Marker 
                            key={i} 
                            coordinate={{ latitude : parseFloat(value.latitude) , longitude : parseFloat(value.longitude) }}
                            image={value.complete===1?DumpsterComplete:DumpsterMarker}
                        >
                            <Callout >
                                <View style={{padding:3}}>
                                    <Center>
                                        <Text fontSize={18}>Pick-Up Points:</Text>
                                    </Center>
                                    <HStack space={3}>
                                        <Icon
                                            as={<MaterialIcons name="directions" />}
                                            color={"#10b981"}
                                            size={25}
                                        />
                                        <Text fontSize={16}>{value.purok}</Text>
                                    </HStack>
                                    <HStack space={3}>
                                        <Icon
                                            as={<MaterialIcons name="info" />}
                                            color={"#10b981"}
                                            size={25}
                                        />
                                        <Text w={"50%"} fontSize={16}>{value.street + " " + value.barangay}</Text>
                                    </HStack>
                                </View>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>
        </Center>
        </>
    )
}

export default TrackCollectorPage
