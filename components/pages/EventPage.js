import React, { useState, useEffect, useCallback } from "react";
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
import { RefreshControl } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import envs from "../../config/env.js";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import GoogleIcon from "../../assets/google-icon.png";
import { SliderBox } from "react-native-image-slider-box";
import EventModal from "../modals/EventModal";
import moment from "moment";
// import * as Linking from 'expo-linking';
import * as WebBrowser from "expo-web-browser";
import axios from "axios";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const EventPage = () => {
  const [data, setData] = useState([]);
  const [empty, setEmpty] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  let img = [];
  let temp = [];
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(`${envs.BACKEND_URL}/mobile/event/get-events`)
      .then((res) => {
        temp = res.data.data;
        setInfo(temp);
        // for(var x =0; x < res.data.data.eventLine.lineAttachment.length; x++){
        //   tempImg.push(res.data.data.eventLine.lineAttachment[x].filename);
        // }
        setRefreshing(false)
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    axios
      .get(`${envs.BACKEND_URL}/mobile/event/get-events`)
      .then((res) => {
        temp = res.data.data;
        setInfo(temp);
        // for(var x =0; x < res.data.data.eventLine.lineAttachment.length; x++){
        //   tempImg.push(res.data.data.eventLine.lineAttachment[x].filename);
        // }
      })
      .catch((error) => console.log(error));
  }, [setInfo]);
  const setInfo = (data) => {
    if (data.length > 0) {
      setData(data);
      setEmpty(false);
    } else {
      setEmpty(true);
    }
    console.log(empty);
  };
  const [showModal, setShowModal] = useState(false);
  const [dataId, setDataId] = useState();
  const [eventTitle, setEventTitle] = useState("");
  const registerEvent = async (url) => {
    let res = await WebBrowser.openBrowserAsync(url);
    console.log(res);
  };
  // const handleModal = (id) => {
  //   setDataId(id);
  //   for(var x = 0; x < data.length; x++){
  //     if(data[x].event_id === id){
  //       console.log(data[x].event_name);
  //       setEventTitle(data[x].event_name);
  //     }
  //   }
  //   setShowModal(true);
  // }
  return (
    <>
      <View>
      <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
        {empty ? (
          <Text bold textAlign="center" fontSize={24} marginTop={250}>
            No Events As of Now
          </Text>
        ) : (
          
            data.map((arr) => {
              console.log("ASDASDSA");
              img = [];
              if (arr.hasOwnProperty("eventLine")) {
                if (arr.eventLine.lineAttachment.length > 0) {
                  arr.eventLine.lineAttachment.map((atts) => {
                    img.push(atts.filename);
                  });
                  console.log("IMGGG",img);
                }
              }
            
              return (
                <VStack
                  key={arr.event_id}
                  marginLeft={3}
                  marginRight={3}
                  marginTop={2}
                  marginBottom={2}
                  shadow={2}
                  borderRadius="sm"
                  backgroundColor="white"
                >
                  {arr.hasOwnProperty("eventLine") &&
                  arr.eventLine.lineAttachment.length > 0 ? (
                    <SliderBox
                      images={img}
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
                  ) : (
                    <></>
                  )}

                  {arr.hasOwnProperty("eventLine") &&
                  arr.eventLine.lineAttachment.length > 0 ? (
                    <Button
                      borderRadius={100}
                      height={50}
                      width={50}
                      marginTop={-28}
                      marginLeft={260}
                      colorScheme="success"
                      onPress={() => registerEvent(arr.registration_form_url)}
                      zIndex={999}
                    >
                      <Icon
                        as={<MaterialIcons name="pan-tool" />}
                        color="white"
                        size={23}
                        marginLeft={-1}
                      />
                    </Button>
                  ) : (
                    <Button
                      borderRadius={100}
                      height={50}
                      width={50}
                      position="absolute"
                      right={4}
                      top={2}
                      marginLeft={260}
                      colorScheme="success"
                      onPress={() =>
                        registerEvent(arr.registration_form_url)
                      }
                      zIndex={999}
                    >
                      <Icon
                        as={<MaterialIcons name="pan-tool" />}
                        color="white"
                        size={23}
                        marginLeft={-1}
                      />
                    </Button>
                  )}
                  <VStack px={4} pb={4}>
                    <VStack width={260}>
                      <Text bold fontSize={20} marginTop={2}>
                        {arr.event_name}
                      </Text>
                    </VStack>

                    <Row marginLeft={2} padding={1}>
                      <Column>
                        <Icon
                          as={<MaterialIcons name="room" />}
                          color="#10b981"
                          size={21}
                          mt={"auto"}
                        />
                      </Column>
                      <Column>
                        <Text paddingLeft={3}>
                          {arr.street}, {arr.purok}, {arr.barangay}
                        </Text>
                      </Column>
                    </Row>

                    <Row marginLeft={2} padding={1}>
                      <Column>
                        <Icon
                          as={<MaterialIcons name="date-range" />}
                          color="#10b981"
                          size={21}
                          mt={"auto"}
                        />
                      </Column>
                      <Column>
                        <Text fontSize={13} paddingLeft={3}>
                          {moment(arr.startDate.substring(0, 10)).format(
                            "MM/DD/YYYY hh:mm A"
                          )}{" "}
                          -{" "}
                          {moment(arr.endDate.substring(0, 10)).format(
                            "MM/DD/YYYY hh:mm A"
                          )}
                        </Text>
                      </Column>
                    </Row>
                    <Row marginLeft={2} padding={1}>
                      <Column>
                        <Icon
                          as={<MaterialIcons name="people" />}
                          color="#10b981"
                          size={21}
                          mt={"auto"}
                        />
                      </Column>
                      <Column>
                        <Text paddingLeft={3}>{arr.target_participants}</Text>
                      </Column>
                    </Row>
                    <Row marginLeft={2} padding={1}>
                      <Column>
                        <Icon
                          as={<MaterialIcons name="contact-page" />}
                          color="#10b981"
                          size={21}
                          mt={"auto"}
                        />
                      </Column>
                      <Column>
                        <Text paddingLeft={3}>
                          {arr.eventAdmin.fname} {arr.eventAdmin.lname}
                        </Text>
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
                  <EventModal
                    id={dataId}
                    title={eventTitle}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                </VStack>
              );
            })
        
        )}
        </ScrollView>
      </View>
    </>
  );
};

export default EventPage;
