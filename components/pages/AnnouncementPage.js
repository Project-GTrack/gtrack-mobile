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
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import { Line } from "react-native-svg";

const AnnouncementPage = () => {
  const arr = [
    {
      id: 1,
      person: "Arya Stark",
      type: "Admin",
      date: "January 3, 2022 10:00 PM",
      description: "Happening NOW: Compostela Municipal Coastal Cleanup 2022",
      content:
        " NativeBase V3 a universal Design System for Mobile & Web built for React Native and React with the same API. Ships a bunch of components for most of the use-cases that includes Button, AppBar, Dialog, Modal and what not.",
      avatar: GoogleIcon,
    },
    {
      id: 2,
      person: "Sansa Stark",
      type: "Chair",
      date: "January 3, 2022 10:00 PM",
      description: "Happening NOW: Compostela Municipal Coastal Cleanup 2022",
      avatar: GtrackMainLogo,
    },
    {
      id: 3,
      person: "Bran Stark",
      type: "HR",
      date: "January 3, 2022 10:00 PM",
      description: "Happening NOW: Compostela Municipal Coastal Cleanup 2022",
      avatar: GtrackMainLogo,
    },
  ];
  return (
    <View>
      <ScrollView>
        {arr.map((arr) => {
          return (
            <VStack
              key={arr.id}
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
                  source={arr.avatar}
                />
                <VStack ml={2} space={2}>
                  <Text fontSize="lg" bold>
                    {arr.person} | {arr.type} {"\n"}
                    <Text>{arr.date}</Text>
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
                <Text bold>{arr.description}</Text>
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
    </View>
  );
};

export default AnnouncementPage;
