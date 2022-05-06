import React,{useEffect, useState} from 'react'
import {
    Text,
    Center,
    Icon,
    HStack,
    Menu,
    Button
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
const TrackCollectorPage = ({userLoc}) => {
    const { height, width } = Dimensions.get( 'window' );
    const LATITUDE_DELTA=0.23;
    const [marginBottom,setMarginBottom]=useState(1);
    const [initLoc,setInitLoc]=useState({
        latitude: 10.4659,
        longitude: 123.9806,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA * (width / height)});
    const [drivers,setDrivers]=useState([]);
    const [filter,setFilter]=useState("All");
    const [dumpsters,setDumpsters]=useState([]);
    const [shouldOverlapWithTrigger] = useState(false);
    const getFirebaseDrivers = () => {
        database.ref(`Drivers/`).on('value', function (snapshot) {
            if(snapshot.val()){
                var snap=snapshot.val();
                var temp=Object.keys(snap).map((key) => snap[key]);
                setDrivers(temp);
            }else{
                setDrivers([]);
            }
        });
     }
     const getFirebaseDumpsters = () => {
        database.ref(`Dumpsters/`).on('value', function (snapshot) {
            if(snapshot.val()){
                var snap=snapshot.val();
                var temp=Object.keys(snap).map((key) => snap[key]);
                setDumpsters(temp);
            }else{
                setDumpsters([]);
            }
        });
     }
    useEffect(() => {
        LogBox.ignoreLogs(['Setting a timer']);
        getFirebaseDrivers();
        getFirebaseDumpsters();
        return ()=>{
            setFilter("All");
        }
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
                initialRegion={userLoc}
                showsUserLocation={true}
                showsMyLocationButton={true}
                provider={PROVIDER_GOOGLE}
                onMapReady={()=>setMarginBottom(0)}
                style={{
                    width: '100%',
                    height: '100%',
                    marginBottom:marginBottom
                }} >
                    {(filter=="All"||filter=="Collectors Only")?
                        (drivers && drivers.map((value,i)=>{
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
                    })):(<></>)
                    }
                    {(filter=="All"||filter=="Dumpsters Only")?
                        (dumpsters && dumpsters.map((value,i)=>{
                            return (

                                <Marker 
                                    key={i} 
                                    coordinate={{ latitude : parseFloat(value.latitude) , longitude : parseFloat(value.longitude) }}
                                    image={value.complete===1?DumpsterComplete:DumpsterMarker}
                                >
                                    <Callout >
                                        <View style={{padding:3}}>
                                            <Center>
                                                <Text fontSize={16}>Pick-Up Points:</Text>
                                            </Center>
                                            <HStack space={3}>
                                                <Icon
                                                    as={<MaterialIcons name="directions" />}
                                                    color={"#10b981"}
                                                    size={22}
                                                />
                                                <Text fontSize={14}>{value.landmark}</Text>
                                            </HStack>
                                            <HStack space={3}>
                                                <Icon
                                                    as={<MaterialIcons name="info" />}
                                                    color={"#10b981"}
                                                    size={22}
                                                />
                                                <Text w={"100%"} fontSize={12}>{`${value.purok} ${value.street} ${value.barangay}`}</Text>
                                            </HStack>
                                        </View>
                                    </Callout>
                                </Marker>
                            );
                        })):(<></>)
                    }
                </MapView>
                <Menu
                alignSelf={"center"}
                shouldOverlapWithTrigger={shouldOverlapWithTrigger}
                placement={"top right"} 
                trigger={triggerProps => {
                return (
                    <HStack alignContent={"center"} alignItems={"center"} position={"absolute"} 
                    right={16}
                    top={3} >
                        <Text mr={"2"} fontSize={16}>Filter:</Text>
                        <Button 
                            
                            colorScheme="success"
                            {...triggerProps}
                            rightIcon={
                                <Icon
                                    as={<MaterialIcons name="arrow-drop-down" />}
                                    size={"sm"}
                                />
                            }
                        >
                            {filter}
                        </Button>
                    </HStack>
                );
                }}>
                    <Menu.Item onPress={()=>setFilter("All")}>All</Menu.Item>
                    <Menu.Item onPress={()=>setFilter("Dumpsters Only")}>Dumpsters Only</Menu.Item>
                    <Menu.Item onPress={()=>setFilter("Collectors Only")}>Collectors Only</Menu.Item>
                </Menu>  
            </Center>
        </>
    )
}

export default TrackCollectorPage
