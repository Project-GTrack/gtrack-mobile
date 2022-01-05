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
import MapView from 'react-native-maps';
import { Dimensions } from 'react-native';
import TrackCollectorPage from '../TrackCollectorPage';
import MarkDumpsterPage from '../MarkDumpsterPage'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const TopBar = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Share Location" component={TrackCollectorPage} />
      <Tab.Screen name="Mark Dumpster" component={MarkDumpsterPage} />
    </Tab.Navigator>
  );
}

export default TopBar;
