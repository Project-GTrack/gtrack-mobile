import React, { useEffect } from "react";
import {
  Button,
  Icon,
  Link,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AnnouncementPage from "../pages/AnnouncementPage";
import EventPage from "../pages/EventPage";
import SchedulePage from "../pages/SchedulePage";
import TrackCollectorPage from "../pages/TrackCollectorPage";
import TopBar from "../pages/driver/helpers/TopBar";
// import ReportPage from "../pages/driver/ReportPage";
import ReportPage from "../pages/ReportPage";
import ProfilePage from "../pages/ProfilePage";
import InputGarbageWeightPage from "../pages/InputGarbageWeightPage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from "react/cjs/react.development";

const Tab = createBottomTabNavigator();

const getData = async (setUser) => {
  const value = await AsyncStorage.getItem('@user');
  if(value!==null){
    setUser(JSON.parse(value));
  }
}
const Toolbar = ({navigation}) => {
  const [user,setUser]=useState(null);
  useEffect(() => {
    getData(setUser);
  }, []);
  
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
            headerRight:(tabInfo) =>(
              <Link onPress={()=>navigation.openDrawer()}>
              <Icon
                as={<MaterialIcons name="menu" />}
                color={"#10b981"}
                size={26}
                mx={3}
              />
              </Link>
            )
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
            headerRight:(tabInfo) =>(
              <Link onPress={()=>navigation.openDrawer()}>
              <Icon
                as={<MaterialIcons name="menu" />}
                color={"#10b981"}
                size={26}
                mx={3}
              />
              </Link>
            )
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
            headerRight:(tabInfo) =>(
              <Link onPress={()=>navigation.openDrawer()}>
              <Icon
                as={<MaterialIcons name="menu" />}
                color={"#10b981"}
                size={26}
                mx={3}
              />
              </Link>
            )
          }}
        />
        {user && user.user_type==="Driver"?(
          <Tab.Screen
          name="Location Map"
          component={TopBar}
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
            headerRight:(tabInfo) =>(
              <Link onPress={()=>navigation.openDrawer()}>
              <Icon
                as={<MaterialIcons name="menu" />}
                color={"#10b981"}
                size={26}
                mx={3}
              />
              </Link>
            )
          }}
        />
        ):(<Tab.Screen
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
            headerRight:(tabInfo) =>(
              <Link onPress={()=>navigation.openDrawer()}>
              <Icon
                as={<MaterialIcons name="menu" />}
                color={"#10b981"}
                size={26}
                mx={3}
              />
              </Link>
            )
          }}
        />)}
        
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
            headerRight:(tabInfo) =>(
              <Link onPress={()=>navigation.openDrawer()}>
              <Icon
                as={<MaterialIcons name="menu" />}
                color={"#10b981"}
                size={26}
                mx={3}
              />
              </Link>
            )
          }}
        />
        {user && user.user_type==="Driver"?(
          <Tab.Screen
            name="Input Garbage Weight"
            component={InputGarbageWeightPage}
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
                  as={<MaterialIcons name="restore-from-trash" />}
                  color={tabInfo.focused ? "white" : "#284c36"}
                  size={26}
                  mt={"auto"}
                />
              ),
              headerRight:(tabInfo) =>(
                <Link onPress={()=>navigation.openDrawer()}>
                <Icon
                  as={<MaterialIcons name="menu" />}
                  color={"#10b981"}
                  size={26}
                  mx={3}
                />
                </Link>
              )
            }}
          />
        ):(<></>)}
        
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
            headerRight:(tabInfo) =>(
              <Link onPress={()=>navigation.openDrawer()}>
              <Icon
                as={<MaterialIcons name="menu" />}
                color={"#10b981"}
                size={26}
                mx={3}
              />
              </Link>
            )
          }}
        />
      </Tab.Navigator>
  );
};

export default Toolbar;
