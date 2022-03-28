import React, { useEffect, useCallback } from "react";
import {
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
import { SliderBox } from "react-native-image-slider-box";
import moment from "moment";
import * as WebBrowser from "expo-web-browser";
import axios from "axios";
import Shimmer from "../helpers/Shimmer.js";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const EventPage = ({ events, setEvents, refreshing, setRefreshing }) => {
  let img = [];
  let temp = [];
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios
      .get(`${envs.BACKEND_URL}/mobile/event/get-events`)
      .then((res) => {
        temp = res.data.data;
        setEvents(temp);
        setRefreshing(false);
      })
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    if (events.length > 0) {
      setRefreshing(false);
    } else {
      wait(2000).then(() => setRefreshing(false));
    }
  }, [events]);
  const registerEvent = async (url) => {
    let res = await WebBrowser.openBrowserAsync(url);
  };
  return (
    <>
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
            events && events.length > 0 ? (
              events.map((data, i) => {
                return (
                  <Shimmer key={i} type="events"/>
                );
              })
            ) : (
             <Shimmer type="events"/>
            )
          ) : events.length === 0 ? (
            <Text bold textAlign="center" fontSize={24} marginTop={250}>
              No Events As of Now
            </Text>
          ) : (
            events &&
            events.map((arr) => {
              img = [];
              if (arr.hasOwnProperty("eventLine")) {
                if (arr.eventLine.lineAttachment.length > 0) {
                  arr.eventLine.lineAttachment.map((atts) => {
                    img.push(atts.filename);
                  });
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
                        autoplay
                      />
                    </Center>
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
                          {moment(arr.startDate).format("MMM DD, YYYY")}{" "}
                          {moment(arr.startDate.substring(11,16), ["HH:mm A"]).format("h:mm A")}{" "}
                          -{" "}
                          {moment(arr.endDate).format("MMM DD, YYYY")}{" "}
                          {moment(arr.endDate.substring(11,16), ["HH:mm A"]).format("h:mm A")}
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
                  </VStack>
                  <VStack px={4} pb={4} marginTop={-5}>
                    <Text bold fontSize={16} mt={2}>
                      About the Event
                    </Text>
                    <Text marginLeft={5}>{arr.description}</Text>
                  </VStack>
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
