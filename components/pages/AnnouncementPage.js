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
import envs from '../../config/env.js'
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import { Line } from "react-native-svg";
import axios from "axios";

const AnnouncementPage = () => {
  const [data,setData]=useState([]);
  let temp = [];
  useEffect(()=>{
    axios.get("https://plastic-starfish-10.loca.lt/mobile/announcement/get-announcements")
      .then((res) => {
        temp=res.data.data;
        setInfo(temp);
      })
      .catch(error => console.log(error));
      
  },[])
  const setInfo = (data) =>{
    if(data !== []){
      setData(data)
    }else{
      setData(null);
    }
    
}
  return (
    <View>
      <ScrollView>
      {(() => {
           if(data.length !== 0){
             console.log(data.length);
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
                          {arr.announcementAdmin.fname} {arr.announcementAdmin.lname} | {arr.announcementAdmin.user_type} {"\n"}
                          <Text>{arr.createdAt}</Text>
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
           }else{
             console.log(data);
             return (
              <VStack
                marginLeft={3}
                marginRight={3}
                marginTop={2}
                marginBottom={2}
                height={100}
                shadow={2}
                borderRadius="sm"
                backgroundColor="white"
              >
               <Text bold textAlign="center" fontSize={24} marginTop={35}>No Announcements Posted</Text>
              </VStack>
             );
           }
          })()}
              
             
        
      </ScrollView>
    </View>
  );
};

export default AnnouncementPage;
