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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { array } from "yup/lib/locale";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const AnnouncementPage = ({announcements,setAnnouncements,refreshing,setRefreshing}) => {
  let img = [];
  let temp = [];
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(`${envs.BACKEND_URL}/mobile/announcement/get-announcements`)
      .then((res) => {
        temp = res.data.data;
        setAnnouncements(temp);
        setRefreshing(false);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    if (announcements.length > 0) {
      setRefreshing(false);
    } else {
      wait(2000).then(() => setRefreshing(false));
    }
  }, [announcements]);
  return (
    <View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#10b981"]}
          />
        }
      >
        {refreshing ? (
          announcements && announcements.length > 0 ? (
            announcements.map((data, i) => {
              return (
                <VStack
                  key={i}
                  marginLeft={3}
                  marginRight={3}
                  marginTop={2}
                  marginBottom={2}
                  shadow={2}
                  borderRadius="sm"
                  backgroundColor="white"
                >
                  <HStack alignItems="center" px={4} pt={4}>
                    <ShimmerPlaceholder
                      width={50}
                      height={50}
                      shimmerStyle={{ borderRadius: 100 }}
                    />
                    <VStack ml={2} space={2}>
                      <Text>
                        <ShimmerPlaceholder
                          shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                          width={150}
                        />{" "}
                        {"\n"}
                        <ShimmerPlaceholder
                          shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                          width={150}
                        />
                      </Text>
                      <View
                        style={{
                          borderBottomColor: "black",
                          borderBottomWidth: 1,
                        }}
                      />
                    </VStack>
                  </HStack>
                  <Text bold fontSize={21} px={4} pb={1}>
                    <ShimmerPlaceholder
                      shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                      width={150}
                    />
                  </Text>
                  <ShimmerPlaceholder width={336} height={200} />

                  <VStack px={4} pt={4} pb={5}>
                    <ShimmerPlaceholder
                      shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                      width={300}
                    />
                    <ShimmerPlaceholder
                      shimmerStyle={{ borderRadius: 10, marginTop: 6 }}
                      width={300}
                    />
                    <ShimmerPlaceholder
                      shimmerStyle={{ borderRadius: 10, marginTop: 6 }}
                      width={300}
                    />
                  </VStack>
                </VStack>
              );
            })
          ) : (
            <VStack
              marginLeft={3}
              marginRight={3}
              marginTop={2}
              marginBottom={2}
              shadow={2}
              borderRadius="sm"
              backgroundColor="white"
            >
              <HStack alignItems="center" px={4} pt={4}>
                <ShimmerPlaceholder
                  width={50}
                  height={50}
                  shimmerStyle={{ borderRadius: 100 }}
                />
                <VStack ml={2} space={2}>
                  <Text>
                    <ShimmerPlaceholder
                      shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                      width={150}
                    />{" "}
                    {"\n"}
                    <ShimmerPlaceholder
                      shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                      width={150}
                    />
                  </Text>
                  <View
                    style={{
                      borderBottomColor: "black",
                      borderBottomWidth: 1,
                    }}
                  />
                </VStack>
              </HStack>
              <Text bold fontSize={21} px={4} pb={1}>
                <ShimmerPlaceholder
                  shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                  width={150}
                />
              </Text>
              <ShimmerPlaceholder width={336} height={200} />

              <VStack px={4} pt={4} pb={5}>
                <ShimmerPlaceholder
                  shimmerStyle={{ borderRadius: 10, marginTop: 2 }}
                  width={300}
                />
                <ShimmerPlaceholder
                  shimmerStyle={{ borderRadius: 10, marginTop: 6 }}
                  width={300}
                />
                <ShimmerPlaceholder
                  shimmerStyle={{ borderRadius: 10, marginTop: 6 }}
                  width={300}
                />
              </VStack>
            </VStack>
          )
        ) : announcements.length === 0 ? (
          <Text bold textAlign="center" fontSize={24} marginTop={250}>
            No Announcements As of Now
          </Text>
        ) : (
          announcements &&
          announcements.map((arr) => {
            img = [];
            if (arr.hasOwnProperty("announcementLine")) {
              if (arr.announcementLine.lineAttachment.length > 0) {
                arr.announcementLine.lineAttachment.map((atts) => {
                  img.push(atts.filename);
                });
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
                  {arr.announcementAdmin.image?(
                    <Avatar
                      borderWidth={1}
                      size="md"
                      backgroundColor="white"
                      source={{ uri: arr.announcementAdmin.image }}
                    />
                  ):(
                    <Avatar 
                      borderWidth={1}
                      size="md"
                      _text={{color:"white",fontSize:"lg",textTransform:"uppercase"}}
                      backgroundColor="gray.400"
                    >
                      {arr.announcementAdmin.fname[0]+arr.announcementAdmin.lname[0]}
                    </Avatar>
                  )}
                  
                  <VStack ml={2} space={2} style={{alignSelf:'stretch',width:"80%"}}>
                    <Text fontSize="sm" bold>
                      {arr.announcementAdmin.fname.charAt(0).toUpperCase() +
                        arr.announcementAdmin.fname.slice(1)}{" "}
                      {arr.announcementAdmin.lname.charAt(0).toUpperCase() +
                        arr.announcementAdmin.lname.slice(1)}{" "}
                      | {arr.announcementAdmin.user_type} {"\n"}
                      <Text fontSize="sm">
                        {moment(arr.createdAt).format("MMMM D, Y")} at{" "}
                        {(() => {
                          var ts = arr.createdAt.match(/\d\d:\d\d/).toString();
                          var H = +ts.substring(0, 2);
                          var h = H % 12 || 12;
                          h = h < 10 ? "0" + h : h;
                          var ampm = H < 12 ? " AM" : " PM";
                          ts = h + ts.substring(2, 5) + ampm;
                          return ts;
                        })()}
                      </Text>
                    </Text>
                    <Divider style={{
                        alignSelf:'stretch',
                      }}  
                      bgColor={"gray.400"}
                    />
                  </VStack>
                </HStack>
                <Text bold fontSize={20} mt={1} px={4}>
                  {arr.title}
                </Text>
                <Text fontSize={16} px={4} mb={2}>{arr.content}</Text>
                {arr.hasOwnProperty("announcementLine") &&
                arr.announcementLine.lineAttachment.length > 0 ? (
                  <Center height={200}>
                    <SliderBox
                      images={img}
                      sliderBoxHeight={200}
                      parentWidth={336}
                      // onCurrentImagePressed={(index) =>
                      //   console.warn(`image ${index} pressed`)
                      // }
                      dotColor="#10b981"
                      inactiveDotColor="#90A4AE"
                      paginationBoxVerticalPadding={10}
                    />
                  </Center>
                ) : (
                  <></>
                )}

                {/* <VStack
                  px={4}
                  pt={
                    arr.hasOwnProperty("announcementLine") &&
                    arr.announcementLine.lineAttachment.length > 0
                      ? 4
                      : 0
                  }
                  pb={5}
                >
                </VStack> */}
              </VStack>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default AnnouncementPage;
