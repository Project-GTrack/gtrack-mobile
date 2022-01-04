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
  Column
} from "native-base";
import { StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../../assets/gtrack-logo-1.png";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import GoogleIcon from "../../../assets/google-icon.png";

const ReportPage = () => {
   
    const pickImage = () => {
        const options = {
            mediaType: "photo",
            quality: 1,
            cameraType: 'back'
        }
        launchCamera(options, (res) => {
            if(res.didCancel){
                console.log("Cancelled")
            }
        })
    };
  
  return (
    <View>
      <ScrollView>
      <Center
            px={5}
            mt={-12}
        >
           <Image
                  size={250}
                  borderRadius="md"
                  resizeMode={"contain"}
                  source={GtrackMainLogo}
                  alt="GTrack Logo"
                />
        </Center>
            <VStack
              marginLeft={3}
              marginRight={3}
              marginTop={-10}
              marginBottom={2}
              shadow={2}
              borderRadius="sm"
              backgroundColor="white"
            >

              <VStack px={4} pb={4} mt={5}>
                <FormControl paddingBottom={5}>
                    <Input borderColor="black" placeholder="Subject"/>
                </FormControl>
                <FormControl paddingBottom={5}>
                <TextArea
                    h={20}
                    borderColor="black"
                    placeholder="What is the issue?"
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
                    <Input h={8} borderColor="black" isReadOnly="true" isDisabled="true" value="10.4494"/>
                    </VStack>
                    <VStack minWidth="100">
                    <Input h={8} borderColor="black" isReadOnly="true"isDisabled="true" value="124.0070"/>
                    </VStack>
                </HStack>
                </FormControl>
                <FormControl>
                <HStack mt={2}>
                    <VStack paddingTop={1}>
                    <FormControl.Label>Attachments</FormControl.Label>
                    </VStack>
                    <VStack minWidth="100">
                    <Button mt={3} colorScheme="success" onPress={pickImage} 
            leftIcon={ <Icon
                as={<MaterialIcons name="attachment" />}
                color={'white'}
                size={5}
            />} 
        >
            Take a Photo
        </Button>
                    </VStack>
                </HStack>
                </FormControl>
                
              </VStack>
            </VStack>
      </ScrollView>
    </View>
  );
};
    

export default ReportPage;
