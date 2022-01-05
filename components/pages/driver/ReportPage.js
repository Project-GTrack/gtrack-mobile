import React from "react";
import {
  Text,
  TextInput,
  Image,
  Button,
  Center,
  Input,
  Divider,
  Link,
  Icon,
  Box,
  Stack,
  Container,
  Card,
  Content,
  CardItem,
  Row,
  ScrollView,
  FormControl,
  VStack,
  HStack,
  Avatar,
  List,
  View,
  TextArea,
  Slider,
  Column,
} from "native-base";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../../assets/gtrack-logo-1.png";
import * as ImagePicker from "expo-image-picker";
import GoogleIcon from "../../../assets/google-icon.png";

const ReportPage = () => {
  const pickImage = () => {
    const options = {
      mediaType: "photo",
      quality: 1,
      cameraType: "back",
    };
    launchCamera(options, (res) => {
      if (res.didCancel) {
        console.log("Cancelled");
      }
    });
  };

  return (
    <View>
      <ScrollView>
        <VStack px={4} pb={4} mt={5}>
          <FormControl paddingBottom={5}>
            <Input bgColor="white" placeholder="Subject" />
          </FormControl>
          <FormControl paddingBottom={5}>
            <TextArea
              h={200}
              bgColor={"white"}
              placeholder="Write description here ..."
              style={{
                textAlignVertical: "top",
                fontSize: 14,
              }}
              p={3}
            />
          </FormControl>
          <Divider />
          <FormControl>
            <HStack>
              <VStack>
                <FormControl.Label>Degree</FormControl.Label>
              </VStack>
              <VStack width="250">
                <Slider defaultValue={70} colorScheme="emerald">
                  <Slider.Track>
                    <Slider.FilledTrack />
                  </Slider.Track>
                  <Slider.Thumb />
                </Slider>
              </VStack>
            </HStack>
          </FormControl>
          <FormControl>
            <HStack>
              <VStack paddingTop={1}>
                <FormControl.Label>Coordinates</FormControl.Label>
              </VStack>
              <VStack paddingRight={3} minWidth="100">
                <Input
                  h={8}
                  borderColor="black"
                  isReadOnly="true"
                  isDisabled="true"
                  value="10.4494"
                />
              </VStack>
              <VStack minWidth="100">
                <Input
                  h={8}
                  borderColor="black"
                  isReadOnly="true"
                  isDisabled="true"
                  value="124.0070"
                />
              </VStack>
            </HStack>
          </FormControl>
          <FormControl>
            <HStack mt={2}>
              <VStack minWidth="100">
                <Upload />
              </VStack>
            </HStack>
          </FormControl>

          <FormControl>
            <Button
              bgColor={"#f43f5e"}
              mt={6}
              mb={2}
              leftIcon={
                <Icon
                  as={<MaterialIcons name="send" />}
                  color={"white"}
                  size={5}
                />
              }
            >
              Send Report
            </Button>
          </FormControl>
        </VStack>
      </ScrollView>
    </View>
  );
};
const Upload = () => {
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      console.log("Cancelled");
    }
  };

  return (
    <Button
      mt={3}
      colorScheme="success"
      onPress={pickImage}
      leftIcon={
        <Icon
          as={<MaterialIcons name="attachment" />}
          color={"white"}
          size={5}
        />
      }
    >
      Attach files/photos
    </Button>
  );
};

export default ReportPage;
