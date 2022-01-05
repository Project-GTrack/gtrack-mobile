import React, { useState } from "react";
import {
  Modal,
  FormControl,
  Input,
  Center,
  Text,
  Row,
  ScrollView,
  VStack,
  Button,
  View,
  Column,
  Icon,
} from "native-base";
import { StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import { SliderBox } from "react-native-image-slider-box";
import EventModal from "../modals/EventModal";

const EventPage = () => {
  const arr = [
    {
      id: 1,
      title: "Tree Planting",
      location: "Poblacion, Compostela",
      date: "September 9, 2021",
      time: "7:00 AM - 11:00 AM",
      organizer: "John Doe",
      description: "Barangays would participate in cleaning their environment",
    },
    {
      id: 2,
      title: "Clean Up - Drive",
      location: "Poblacion, Compostela",
      date: "September 9, 2021",
      time: "7:00 AM - 11:00 AM",
      organizer: "John Doe",
      description: "Barangays would participate in cleaning their environment",
    },
    {
      id: 3,
      title: "Fishing",
      location: "Poblacion, Compostela",
      date: "September 9, 2021",
      time: "7:00 AM - 11:00 AM",
      organizer: "John Doe",
      description: "Barangays would participate in cleaning their environment",
    },
  ];
  const [images, setImages] = useState([
    "https://source.unsplash.com/1024x768/?nature",
    "https://source.unsplash.com/1024x768/?water",
    "https://source.unsplash.com/1024x768/?girl",
    "https://source.unsplash.com/1024x768/?tree", // Network image
  ]);
  const [showModal, setShowModal] = useState(false);
  const [dataId,setDataId]=useState();
  const [eventTitle,setEventTitle]=useState("");
  const handleModal = (id) => {
    setDataId(id);
    for(var x = 0; x < arr.length; x++){
      if(arr[x].id === id){
        console.log(arr[x].title);
        setEventTitle(arr[x].title);
      }
    }
    setShowModal(true);
  }
  return (
    <>
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
               
                <SliderBox
                  images={images}
                  sliderBoxHeight={200}
                  parentWidth={336}
                  onCurrentImagePressed={(index) =>
                    console.warn(`image ${index} pressed`)
                  }
                  dotColor="#10b981"
                  inactiveDotColor="#90A4AE"
                  paginationBoxVerticalPadding={10}
                  autoplay
                />

                <Button
                  borderRadius={100}
                  height={50}
                  width={50}
                  marginTop={-28}
                  marginLeft={260}
                  backgroundColor="#10b981"
                  onPress={() => handleModal(arr.id)}
                  zIndex={999}
                >
                  <Icon
                    as={<MaterialIcons name="pan-tool" />}
                    color="white"
                    size={23}
                    marginLeft={-1}
                  />
                </Button>
                <VStack px={4} pb={4}>
                  <Text bold fontSize={20}>
                    {arr.title}
                  </Text>
                  <Row marginLeft={5} padding={1}>
                    <Column>
                      <Icon
                        as={<MaterialIcons name="room" />}
                        color="#10b981"
                        size={21}
                        mt={"auto"}
                      />
                    </Column>
                    <Column>
                      <Text paddingLeft={3}>{arr.location}</Text>
                    </Column>
                  </Row>

                  <Row marginLeft={5} padding={1}>
                    <Column>
                      <Icon
                        as={<MaterialIcons name="date-range" />}
                        color="#10b981"
                        size={21}
                        mt={"auto"}
                      />
                    </Column>
                    <Column>
                      <Text paddingLeft={3}>{arr.date}</Text>
                    </Column>
                  </Row>
                  <Row marginLeft={5} padding={1}>
                    <Column>
                      <Icon
                        as={<MaterialIcons name="watch-later" />}
                        color="#10b981"
                        size={21}
                        mt={"auto"}
                      />
                    </Column>
                    <Column>
                      <Text paddingLeft={3}>{arr.time}</Text>
                    </Column>
                  </Row>
                  <Row marginLeft={5} padding={1}>
                    <Column>
                      <Icon
                        as={<MaterialIcons name="person" />}
                        color="#10b981"
                        size={21}
                        mt={"auto"}
                      />
                    </Column>
                    <Column>
                      <Text paddingLeft={3}>{arr.organizer}</Text>
                    </Column>
                  </Row>

                  <Text>{arr.content}</Text>
                </VStack>
                <VStack px={4} pb={4} marginTop={-5}>
                  <Text bold fontSize={20}>
                    About the Event
                  </Text>
                  <Text marginLeft={5}>{arr.description}</Text>
                </VStack>
                <EventModal id={dataId} title={eventTitle} showModal={showModal} setShowModal={setShowModal}/>
              </VStack>
            );
          })}
        </ScrollView>
      </View>
    </>
  );
};

export default EventPage;
