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
import moment from "moment";
import { Line } from "react-native-svg";
import axios from "axios";
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { array } from "yup/lib/locale";

const AnnouncementPage = () => {
  const [data, setData] = useState([]);
  const [empty, setEmpty] = useState(false);
  let img = [];
  let temp = [];
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
    if (data.length > 0) {
      setData(data);
    } else {
      setEmpty(true);
    }
  };
  return (
    <View>
      {empty ? (
        <Text bold textAlign="center" fontSize={24} marginTop={250}>
          No Announcements As of Now
        </Text>
      ) : (
        <ScrollView>
          {data.map((arr) => {
            if(arr.hasOwnProperty("announcementLine")){
              if(arr.announcementLine.hasOwnProperty("lineAttachment")){
                arr.announcementLine.lineAttachment.map((atts) => {
                  img.push(atts.filename);
                })
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
                    size="lg"
                    backgroundColor="white"
                    source={{uri:arr.announcementAdmin.image}}
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
                <Text bold fontSize={21} px={4} pb={1}>{arr.title}</Text>
                { img.length > 0 ? <SliderBox
                    images={img}
                    sliderBoxHeight={200}
                    parentWidth={336}
                    onCurrentImagePressed={(index) =>
                      console.warn(`image ${index} pressed`)
                    }
                    dotColor="#10b981"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={10}
                  />:<Text marginTop={25} marginLeft={100} italic>No images available</Text>}
                  
                <VStack px={4} pt={4} pb={5}>
                  <Text fontSize={16}>{arr.content}</Text>
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
