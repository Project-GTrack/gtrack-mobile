import React from "react";
import TrackCollectorPage from "../TrackCollectorPage";
import MarkDumpsterPage from "../MarkDumpsterPage";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

const Tab = createMaterialTopTabNavigator();
const TopBar = () => {
 
  return (
    <Tab.Navigator>
      <Tab.Screen name="Share Location" component={TrackCollectorPage} />
      <Tab.Screen name="Mark Dumpster" component={MarkDumpsterPage} />
    </Tab.Navigator>
  );
};

export default TopBar;
