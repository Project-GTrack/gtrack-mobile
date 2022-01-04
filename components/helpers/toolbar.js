import React from "react";
import {
  Icon,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AnnouncementPage from "../pages/AnnouncementPage";
import EventPage from "../pages/EventPage";
import SchedulePage from "../pages/SchedulePage";
import TrackCollectorPage from "../pages/TrackCollectorPage";
// import ReportPage from "../pages/driver/ReportPage";
import ReportPage from "../pages/ReportPage";
import ProfilePage from "../pages/ProfilePage";

const Tab = createBottomTabNavigator();

const Toolbar = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#f0fdf4",
        tabBarStyle: {
          backgroundColor: "#10b981",
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
          headerTintColor: "#10b981",
          headerTitleStyle: {
            fontWeight: "200",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="home" />}
              color={tabInfo.focused ? "white" : "#284c36"}
              size={26}
              mt={"auto"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Events and Seminars"
        component={EventPage}
        options={{
          headerStyle: {
            backgroundColor: "white",
          },
          headerTintColor: "#10b981",
          headerTitleStyle: {
            fontWeight: "200",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="star" />}
              color={tabInfo.focused ? "white" : "#284c36"}
              size={26}
              mt={"auto"}
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
          headerTintColor: "#10b981",
          headerTitleStyle: {
            fontWeight: "200",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="event" />}
              color={tabInfo.focused ? "white" : "#284c36"}
              size={26}
              mt={"auto"}
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
          headerTintColor: "#10b981",
          headerTitleStyle: {
            fontWeight: "200",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="room" />}
              color={tabInfo.focused ? "white" : "#284c36"}
              size={26}
              mt={"auto"}
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
          headerTintColor: "#10b981",
          headerTitleStyle: {
            fontWeight: "200",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="report-problem" />}
              color={tabInfo.focused ? "white" : "#284c36"}
              size={26}
              mt={"auto"}
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
          headerTintColor: "#10b981",
          headerTitleStyle: {
            fontWeight: "200",
          },
          tabBarLabel: "",
          tabBarIcon: (tabInfo) => (
            <Icon
              as={<MaterialIcons name="account-circle" />}
              color={tabInfo.focused ? "white" : "#284c36"}
              size={26}
              mt={"auto"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Toolbar;
