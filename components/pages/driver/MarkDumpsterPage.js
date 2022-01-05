import React from 'react'
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
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';


const MarkDumpsterPage = () => {
    return (
        <>
        <Center
        style={{
            alignSelf:'stretch'
        }}
        >
            <MapView style={{
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
            }} />
        </Center>
        </>
    )
}

export default MarkDumpsterPage
