import React from "react";
import {
  Text,
  Image,
  Button,
  Center,
  Input,
  Divider,
  Link,
  Box,
  Icon,
  Stack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../pages/HomePage";
import AnnouncementPage from "../pages/AnnouncementPage";
import EventPage from "../pages/EventPage";
import SchedulePage from "../pages/SchedulePage";
import TrackCollectorPage from "../pages/TrackCollectorPage";
import ReportPage from "../pages/ReportPage";
import ProfilePage from "../pages/ProfilePage";

const Tab = createBottomTabNavigator();

const Toolbar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#42BA96",
        },
      }}
    >
      <Tab.Screen
        name="Announcements"
        component={AnnouncementPage}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#42BA96",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="home" />}
              color={tabInfo.focused ? "white" : "#8e8e93"}
              size={30}
              marginBottom={-3}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventPage}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#42BA96",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="event" />}
              color={tabInfo.focused ? "white" : "#8e8e93"}
              size={30}
              marginBottom={-3}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Schedules"
        component={SchedulePage}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#42BA96",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="date-range" />}
              color={tabInfo.focused ? "white" : "#8e8e93"}
              size={30}
              marginBottom={-3}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Track Collector"
        component={TrackCollectorPage}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#42BA96",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="room" />}
              color={tabInfo.focused ? "white" : "#8e8e93"}
              size={30}
              marginBottom={-3}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Report/Concern"
        component={ReportPage}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#42BA96",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="report-problem" />}
              color={tabInfo.focused ? "white" : "#8e8e93"}
              size={30}
              marginBottom={-3}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#42BA96",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="account-circle" />}
              color={tabInfo.focused ? "white" : "#8e8e93"}
              size={30}
              marginBottom={-3}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Toolbar;
