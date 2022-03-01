import React, { useCallback, useEffect, useState } from "react";
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
import { StyleSheet, RefreshControl } from "react-native";
import envs from "../../config/env.js";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import moment from "moment";
import { Line } from "react-native-svg";
import axios from "axios";
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { array } from "yup/lib/locale";

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const AnnouncementPage = () => {
  const [data, setData] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  let img = [];
  let temp = [];
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(
        `${envs.BACKEND_URL}/mobile/announcement/get-announcements`
      )
      .then((res) => {
        temp = res.data.data;
        setInfo(temp);
      })
      .catch((error) => console.log(error));
    wait(2000).then(() => setRefreshing(false));
  },[]);
  useEffect(() => {
    axios
      .get(
        `${envs.BACKEND_URL}/mobile/announcement/get-announcements`
      )
      .then((res) => {
        temp = res.data.data;
        setInfo(temp);
      })
      .catch((error) => console.log(error));
     
  }, [setInfo]);
  const setInfo = (data) => {
    console.log(data);
    if (data.length > 0) {
      setData(data);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
  };
  return (
    <View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      {empty ? (
        <Text bold textAlign="center" fontSize={24} marginTop={250}>
          No Announcements As of Now
        </Text>
      ) : (
        
          data.map((arr) => {
            img = [];
            if(arr.hasOwnProperty("announcementLine")){
              if(arr.announcementLine.lineAttachment.length > 0){
                arr.announcementLine.lineAttachment.map((atts) => {
                  img.push(atts.filename);
                })
                console.log(img);
              }
            }
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
                    size="md"
                    backgroundColor="white"
                    source={{uri:arr.announcementAdmin.image}}
                  />
                  <VStack ml={2} space={2}>
                    <Text fontSize="sm" bold>
                      {arr.announcementAdmin.fname.charAt(0).toUpperCase()+arr.announcementAdmin.fname.slice(1)}{" "}
                      {arr.announcementAdmin.lname.charAt(0).toUpperCase()+arr.announcementAdmin.lname.slice(1)} |{" "}
                      {arr.announcementAdmin.user_type} {"\n"}
                      <Text fontSize="sm">{moment(arr.createdAt).format('MMMM D, Y')} at {(() => {
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
                <Text bold fontSize={21} px={4} pb={1}>{arr.title}</Text>
                { arr.hasOwnProperty("announcementLine") && arr.announcementLine.lineAttachment.length > 0 ? <SliderBox
                    images={img}
                    sliderBoxHeight={200}
                    parentWidth={336}
                    onCurrentImagePressed={(index) =>
                      console.warn(`image ${index} pressed`)
                    }
                    dotColor="#10b981"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={10}
                  />:<></>}
                  
                <VStack px={4} pt={arr.hasOwnProperty("announcementLine") && arr.announcementLine.lineAttachment.length > 0 ? 4:0} pb={5}>
                  <Text fontSize={16}>{arr.content}</Text>
                </VStack>
              </VStack>
            );
          })
        
      )}
      </ScrollView>
    </View>
  );
};

export default AnnouncementPage;
