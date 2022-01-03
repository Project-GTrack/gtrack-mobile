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
import GtrackMainLogo from '../../assets/gtrack-logo-1.png'
import GoogleIcon from '../../assets/google-icon.png'


const TrackCollectorPage = () => {
    return (
        <>
        <Center
            px={3}
            mt={10}
        >
            <Image
                size={200}
                resizeMode={"contain"}
                source={GtrackMainLogo}
                alt="GTrack Logo"
            />
            <Text
                mb={5}
                fontSize={"xl"}
                color={"gray.600"}
            >
                Track Collector
            </Text>
        </Center>
        </>
    )
}

export default TrackCollectorPage
