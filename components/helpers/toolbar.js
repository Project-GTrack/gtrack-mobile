import React, { useEffect, useState } from "react";
import {
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
import DriverReportPage from "../pages/driver/DriverReportPage";
import ReportPage from "../pages/ReportPage";
import envs from "../../config/env.js";
import ProfilePage from "../pages/ProfilePage";
import InputGarbageWeightPage from "../pages/InputGarbageWeightPage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import ImageBrowserScreen from "./ImageBrowserScreen";

const Tab = createBottomTabNavigator();

const getData = async (setUser) => {
  const value = await AsyncStorage.getItem('@user');
  if(value!==null){
    setUser(JSON.parse(value));
  }
}
const Toolbar = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(true);
  const [announcements,setAnnouncements] = useState([]);
  const [events,setEvents] = useState([]);
  const [user,setUser]=useState(null);
  useEffect(() => {
    getData(setUser);
  }, []);
  useEffect(() => {
    axios
      .get(
        `${envs.BACKEND_URL}/mobile/announcement/get-announcements`
      )
      .then((res) => {
        let temp = res.data.data;
        setAnnouncements(temp);
      })
      .catch((error) => console.log(error));
    axios
      .get(`${envs.BACKEND_URL}/mobile/event/get-events`)
      .then((res) => {
        let temp = res.data.data;
        setEvents(temp);
      })
      .catch((error) => console.log(error));
     
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
          children={props => <AnnouncementPage announcements={announcements} setAnnouncements={setAnnouncements} refreshing={refreshing} setRefreshing={setRefreshing}/>}
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
          children={props => <EventPage events={events} setEvents={setEvents} refreshing={refreshing} setRefreshing={setRefreshing}/>}
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
        {user && user.user_type==="Driver"?(
          <Tab.Screen
          name="Report"
          component={DriverReportPage}
          options={{
            headerTitle:"Report",
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
        ):(<Tab.Screen
          name="Concern"
          component={ReportPage}
          options={{
            headerTitle:"Concern",
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
        />)}
        
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
        <Tab.Screen
          name='ImageBrowser'
          component={ImageBrowserScreen}
          options={{
            title: 'Selected 0 files',
            tabBarButton: () => null,
            unmountOnBlur:true
          }}
        />
      </Tab.Navigator>
  );
};

export default Toolbar;
