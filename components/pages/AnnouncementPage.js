import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  Center,
  Divider,
  ScrollView,
  VStack,
  HStack,
  Avatar,
  View,
} from "native-base";
import { RefreshControl } from "react-native";
import envs from "../../config/env.js";
import moment from "moment";
import axios from "axios";
import { SliderBox } from "react-native-image-slider-box";
import Shimmer from "../helpers/Shimmer.js";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const AnnouncementPage = ({announcements,setAnnouncements,refreshing,setRefreshing}) => {
  let img = [];
  // const [showMore, setShowMore] = useState([]);
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(`${envs.BACKEND_URL}/mobile/announcement/get-announcements`)
      .then((res) => {
        setAnnouncements(res.data.data);
        setRefreshing(false);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    let arrTemp = [];
    if (announcements.length > 0) {
      // for(var x = 0; x < announcements.length; x++){
      //   var temp = {
      //     announcement_id:announcements[x].announcement_id,
      //     isShowMore:false
      //   }
      //   arrTemp.push(temp);
        
      // }
      // setShowMore(arrTemp);
      setRefreshing(false);
    } else {
      wait(2000).then(() => setRefreshing(false));
    }
  }, [announcements]);
  // const updateShowMore = async (id) => {
  //   const items = [...showMore];
  //   for(var x = 0; x < items.length;x++){
  //     if(items[x].announcement_id === id){
  //       items[x].isShowMore = !items[x].isShowMore;
  //       break;
  //     }
  //   }
  //   setShowMore(items);
  // }
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
                <Shimmer key={i} type="announcements"/>
              );
            })
          ) : (
           <Shimmer type="announcements"/>
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
                  {arr.announcementAdmin.image ? (
                    <Avatar
                      borderWidth={1}
                      size="md"
                      backgroundColor="white"
                      source={{ uri: arr.announcementAdmin.image }}
                    />
                  ) : (
                    <Avatar
                      borderWidth={1}
                      size="md"
                      _text={{
                        color: "white",
                        fontSize: "lg",
                        textTransform: "uppercase",
                      }}
                      backgroundColor="gray.400"
                    >
                      {arr.announcementAdmin.fname[0] +
                        arr.announcementAdmin.lname[0]}
                    </Avatar>
                  )}

                  <VStack
                    ml={2}
                    space={2}
                    style={{ alignSelf: "stretch", width: "80%" }}
                  >
                    <Text fontSize="sm" bold>
                      {arr.announcementAdmin.fname.charAt(0).toUpperCase() +
                        arr.announcementAdmin.fname.slice(1)}{" "}
                      {arr.announcementAdmin.lname.charAt(0).toUpperCase() +
                        arr.announcementAdmin.lname.slice(1)}{" "}
                      | {arr.announcementAdmin.user_type} {"\n"}
                      <Text fontSize="sm">
                        {moment(arr.createdAt).format("MMMM D, Y")} at{" "}
                        {moment(arr.createdAt).format("LT")}
                      </Text>
                    </Text>
                    <Divider
                      style={{
                        alignSelf: "stretch",
                      }}
                      bgColor={"gray.400"}
                    />
                  </VStack>
                </HStack>
                <Text bold fontSize={20} mt={1} px={4}>
                  {arr.title}
                </Text>
                <Text fontSize={16} px={4} mb={2}>{arr.content}</Text>
                {img.length > 0 ? (
                  <Center height={200}>
                    <SliderBox
                      images={img}
                      sliderBoxHeight={200}
                      parentWidth={336}
                      dotColor="#10b981"
                      inactiveDotColor="#90A4AE"
                      paginationBoxVerticalPadding={10}
                    />
                  </Center>
                ) : (
                  <></>
                )}
              </VStack>
            );
          })
        )}
      </ScrollView>
    </View>
    // <Text fontSize={16} px={4} mb={2} numberOfLines={(()=>{
    //   const obj = showMore.find(i => i.announcement_id === arr.announcement_id);
    //   if(obj.isShowMore){
    //     return undefined;
    //   }else{
    //     return 2;
    //   }
    // })()}>
    //   {arr.content}
    // </Text>
    // <Text onPress={()=>updateShowMore(arr.announcement_id)}>{(()=>{
    //   const obj = showMore.find(i => i.announcement_id === arr.announcement_id);
    //   if(obj.isShowMore){
    //     return 'Show less';
    //   }else{
    //     return 'Show more';
    //   }
    // })()}</Text>
  );
};

export default AnnouncementPage;
