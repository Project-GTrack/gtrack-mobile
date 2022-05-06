import React from "react";
import TrackCollectorPage from "../TrackCollectorPage";
import MarkDumpsterPage from "../MarkDumpsterPage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
const TopBar = ({userLoc}) => {
 
  return (
    <Tab.Navigator>
      <Tab.Screen name="Share Location" children={props => <TrackCollectorPage userLoc={userLoc}/>} />
      <Tab.Screen name="Mark Dumpster" children={props => <MarkDumpsterPage userLoc={userLoc}/>}/>
    </Tab.Navigator>
  );
};

export default TopBar;
