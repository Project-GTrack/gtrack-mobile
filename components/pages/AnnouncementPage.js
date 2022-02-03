import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  Button,
  Center,
  Input,
  Divider,
  Link,
  Box,
  Stack,
  Container,
  Card,
  Content,
  CardItem,
  Row,
  ScrollView,
  VStack,
  HStack,
  Avatar,
  List,
  View,
} from "native-base";
import { StyleSheet } from "react-native";
import envs from "../../config/env.js";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import { Line } from "react-native-svg";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AnnouncementPage = () => {
  const [data, setData] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [user,setUser]=useState(null);
  let temp = [];
  useEffect(() => {
    axios
      .get(
        `${envs.BACKEND_URL}/mobile/announcement/get-announcements`
      )
      .then((res) => {
        temp = res.data.data;
        setInfo(temp);
        getData();
      })
      .catch((error) => console.log(error));
     
  }, [setInfo]);
  const setInfo = (data) => {
    if (data.length > 0) {
      setData(data);
    } else {
      setEmpty(true);
    }
  };
  const getData = async () => {
    try {
        const value = await AsyncStorage.getItem('@user');
        if(value!==null){
            setUser(JSON.parse(value));
            console.log("USERRR",value);
        }else{
            setUser(null);
        }
    }catch (e){
        console.log(e);
    }
}
  return (
    <View>
      {empty ? (
        <Text bold textAlign="center" fontSize={24} marginTop={250}>
          No Announcements As of Now
        </Text>
      ) : (
        <ScrollView>
          {data.map((arr) => {
            return (
              <VStack
                key={arr.announcement_id}
                marginLeft={3}
                marginRight={3}
                marginTop={2}
                marginBottom={2}
                shadow={2}
                borderRadius="sm"
                backgroundColor="white"
              >
                <HStack alignItems="center" px={4} pt={4}>
                  <Avatar
                    borderWidth={1}
                    size="lg"
                    backgroundColor="white"
                    source={GtrackMainLogo}
                  />
                  <VStack ml={2} space={2}>
                    <Text fontSize="lg" bold>
                      {arr.announcementAdmin.fname}{" "}
                      {arr.announcementAdmin.lname} |{" "}
                      {arr.announcementAdmin.user_type} {"\n"}
                      <Text>{moment(arr.createdAt.substring(0,10)).format('MMMM D, Y')} at {(() => {
                          var ts = arr.createdAt.match(/\d\d:\d\d/).toString();
                          var H = +ts.substring(0, 2);
                          var h = (H % 12) || 12;
                          h = (h < 10)?("0"+h):h;
                          var ampm = H < 12 ? " AM" : " PM";
                          ts = h + ts.substring(2, 5) + ampm;
                          return ts;
                          })()}</Text>
                    </Text>
                    <View
                      style={{
                        borderBottomColor: "black",
                        borderBottomWidth: 1,
                      }}
                    />
                  </VStack>
                </HStack>

                <VStack px={4} pb={4}>
                  <Text bold>{arr.title}</Text>
                  <Image
                    size={400}
                    borderRadius="md"
                    resizeMode={"contain"}
                    source={GtrackMainLogo}
                    alt="GTrack Logo"
                  />

                  <Text>{arr.content}</Text>
                </VStack>
              </VStack>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default AnnouncementPage;
