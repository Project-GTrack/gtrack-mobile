import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  Image,
  Button,
  Center,
  Input,
  ScrollView,
  Select,
  Icon,
  CheckIcon,
  TextArea,
  Stack,
  VStack,
  View,
  HStack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { fontSize, padding } from "styled-system";
import { Platform } from "react-native";
import { useFormik } from "formik";
import axios from "axios";
import envs from "../../config/env.js";
import MessageAlert from "../helpers/MessageAlert";
import ActivityIndicator from "../helpers/ActivityIndicator";
import moment from "moment";
import Firebase from "../helpers/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as yup from "yup";
import { string } from "yup/lib/locale";

const db = Firebase.app().database();
const InputGarbageWeightPage = () => {
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [curShow, setCurShow] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [alert, setAlert] = useState({
    visible: false,
    message: null,
    colorScheme: null,
    header: null,
  });
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await setLoading(true);
    try {
      const value = await AsyncStorage.getItem("@user");
      if (value !== null) {
        var val = JSON.parse(value)
        setUser(val);
        if(val.hasOwnProperty("userSchedule")){
          var street = val.userSchedule[0].street.charAt(0).toUpperCase() + val.userSchedule[0].street.slice(1);
          var purok = val.userSchedule[0].purok.charAt(0).toUpperCase() + val.userSchedule[0].purok.slice(1);
          var barangay = val.userSchedule[0].barangay.charAt(0).toUpperCase() + val.userSchedule[0].barangay.slice(1);
          var temp = street+", "+purok+", "+barangay;
          setRoute(temp);
          setIsDisabled(false);
        }else{
          setIsDisabled(true);
          setAlert({
            visible: true,
            message: "You have no schedule today",
            colorScheme: "primary",
            header: "Collection Schedule",
          });
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.log(e);
    }
   await setLoading(false);
  };
  // useEffect(() => {
  //   (async () => {
  //     if (user !== null) {
  //       await axios
  //         .get(
  //           `${envs.BACKEND_URL}/mobile/waste-collection/get-route/${user.user_id}`
  //         )
  //         .then((res) => {
  //           if (res.data.success) {
  //             setRoute(res.data.data);
  //             setIsDisabled(false);
  //           } else {
  //             setIsDisabled(true);
  //             setAlert({
  //               visible: true,
  //               message: res.data.message,
  //               colorScheme: "success",
  //               header: "Collection Schedule",
  //             });
  //           }
  //         });
  //         setLoading(false);
  //     }
  //   })();
  // }, [user]);
  const collectionValidation = yup.object().shape({
    weight: yup.string().required("Weight Volume is required"),
    schedule: yup.object().shape({
      date: yup.string().required("Date is required"),
      time: yup.string().required("Time is required"),
    }),
  });
  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    await axios
      .post(
        `${envs.BACKEND_URL}/mobile/waste-collection/submit-collection/${user.user_id}`,
        {
          collection_weight_volume: values.weight,
          collection_date: moment(values.schedule.date).format("YYYY-MM-DD")+" "+values.schedule.time.toString().substring(16,24),
          collection_route: route,
        }
      )
      .then((res) => {
        if (res.data.success) {
          db.ref("Dumpsters/").once("value", (snapshot) => {
            for (var x = 0; x < snapshot.val().length; x++) {
              if (snapshot.val()[x] != undefined) {
                if (
                  snapshot.val()[x].driver_id != undefined &&
                  snapshot.val()[x].driver_id === user.user_id
                ) {
                  db.ref("Dumpsters/" + snapshot.val()[x].dumpster_id).update({
                    complete: 0,
                  });
                  db.ref("Dumpsters/" + snapshot.val()[x].dumpster_id)
                    .child("driver_id")
                    .remove();
                  axios.put(
                    `${envs.BACKEND_URL}/mobile/dumpster/update-dumpster/${
                      snapshot.val()[x].dumpster_id
                    }`
                  );
                }
              }
            }
          });
          resetForm();
          setLoading(false);
          setAlert({
            visible: true,
            message: res.data.message,
            colorScheme: "success",
            header: "Waste Collection Report",
          });
        }
      });
    // if (values.weight !== "" && route != "" && date != "" && startTime != "") {
    //   setLoading(true);
    //   axios
    //     .post(
    //       `${envs.BACKEND_URL}/mobile/waste-collection/submit-collection/${user.user_id}`,
    //       {
    //         collection_weight_volume: values.weight,
    //         date: moment(date).format("MM-DD-YY"),
    //         start_time: moment(startTime).format("HH:mm:ss"),
    //         end_time: moment(endTime).format("HH:mm:ss"),
    //         collection_route: route,
    //       }
    //     )
    //     .then((res) => {
    //       if (res.data.success) {
    //         db.ref("Dumpsters/").once("value", (snapshot) => {
    //           for (var x = 0; x < snapshot.val().length; x++) {
    //             if (snapshot.val()[x] != undefined) {
    //               if (
    //                 snapshot.val()[x].driver_id != undefined &&
    //                 snapshot.val()[x].driver_id === user.user_id
    //               ) {
    //                 db.ref("Dumpsters/" + snapshot.val()[x].dumpster_id).update(
    //                   { complete: 0 }
    //                 );
    //                 db.ref("Dumpsters/" + snapshot.val()[x].dumpster_id)
    //                   .child("driver_id")
    //                   .remove();
    //                 axios.put(
    //                   `${envs.BACKEND_URL}/mobile/dumpster/update-dumpster/${
    //                     snapshot.val()[x].dumpster_id
    //                   }`
    //                 );
    //               }
    //             }
    //           }
    //         });
    //         resetForm();
    //         setDate("");
    //         setStartTime("");
    //         setEndTime("");
    //         setRoute("");
    //         setLoading(false);
    //         setAlert({
    //           visible: true,
    //           message: res.data.message,
    //           colorScheme: "success",
    //           header: "Waste Collection Report",
    //         });
    //       }
    //     });
    // } else {
    //   resetForm();
    //   setDate("");
    //   setStartTime("");
    //   setEndTime("");
    //   setRoute("");
    //   setLoading(false);
    //   setAlert({
    //     visible: true,
    //     message: "Please fill out all the fields",
    //     colorScheme: "danger",
    //     header: "Empty Fields",
    //   });
    // }
  };
  const { handleChange, handleSubmit, values, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        weight: "",
        schedule: {
          date: "",
          time:""
        },
      },
      enableReinitialize: true,
      validationSchema: collectionValidation,
      onSubmit: handleFormSubmit,
    });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    if (currentDate !== undefined) {
      if (curShow === "date") {
        setFieldValue("schedule.date", moment(currentDate));
      } else {
        setFieldValue("schedule.time", moment(currentDate));
      }
    }
  };

  const showMode = (currentMode) => {
    setShow(true);
    if (currentMode === "time") {
      setMode("time");
      setCurShow(currentMode);
    } else {
      setMode(currentMode);
      setCurShow(currentMode);
    }
  };
  const showDatepicker = () => {
    showMode("date");
  };

  const showStartTimepicker = () => {
    showMode("time");
  };
  return (
    <>
      <View>
        <MessageAlert alert={alert} setAlert={setAlert} />
        <ScrollView>
          <Center>
            <Image
              size={230}
              borderRadius="md"
              resizeMode={"contain"}
              source={GtrackMainLogo}
              alt="GTrack Logo"
            />
          </Center>
          <VStack
            marginLeft={3}
            marginRight={3}
            marginTop={2}
            marginBottom={2}
            shadow={2}
            borderRadius="sm"
            backgroundColor="white"
          >
            <Center px={5} mt={10}>
              <Stack space={3} style={{ alignSelf: "stretch" }}>
                <HStack>
                  <VStack paddingRight={3}>
                    <Input
                      size="md"
                      width={175}
                      bg={"white"}
                      value={
                        values.schedule.date != ""
                          ? moment(values.schedule.date).format(
                              "MMMM D, Y"
                            )
                          : ""
                      }
                      onChangeText={handleChange("schedule.date")}
                      placeholder="Date"
                      isReadOnly="true"
                      isDisabled="true"
                    />
                    {errors.schedule && touched.schedule && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.schedule.date ||
                          errors.schedule.time}
                      </Text>
                    )}
                  </VStack>
                  <VStack paddingRight={2}>
                    <Input
                      size="md"
                      bg={"white"}
                      width={120}
                      value={
                        values.schedule.time != ""
                          ? moment(values.schedule.time).format("h:mm A")
                          : ""
                      }
                      onChangeText={handleChange("schedule.time")}
                      placeholder="Time"
                      isReadOnly="true"
                      isDisabled="true"
                    />
                  </VStack>
                </HStack>

                <Center>
                  <HStack>
                    <VStack paddingRight={15} marginLeft={2}>
                      <Button
                        onPress={showDatepicker}
                        colorScheme="success"
                        title="Show date picker!"
                      >
                        Select Date
                      </Button>
                    </VStack>
                    <VStack paddingRight={2}>
                      <Button
                        onPress={showStartTimepicker}
                        colorScheme="success"
                        title="Show time picker!"
                      >
                        Select Time
                      </Button>
                    </VStack>
                  </HStack>
                </Center>

                {show && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={new Date()}
                    mode={mode}
                    is24Hour={false}
                    display="default"
                    onChange={onChange}
                  />
                )}

                <Input
                  size="md"
                  isRequired
                  bg={"white"}
                  value={isDisabled ? "No schedule today" : route}
                  placeholder="Collection Route"
                  isReadOnly="true"
                  isDisabled="true"
                />
                {/* <Select
                selectedValue={route}
                accessibilityLabel="Choose Collection Route"
                placeholder="Choose Collection Route"
                _selectedItem={{
                  bg: "success.500",
                  endIcon: <CheckIcon size="5" />,
                }}
                dropdownIcon={
                  <Icon
                    as={<MaterialIcons name="unfold-more" />}
                    color={"#10b981"}
                    size={7}
                  />
                }
                style={{
                  borderWidth: 1,
                  borderColor: "#10b981",
                }}
                onValueChange={(itemValue) => setRoute(itemValue)}
              >
                <Select.Item
                  label="Municipal Grounds"
                  value="Municipal Grounds"
                />
                <Select.Item label="Market" value="Market" />
                <Select.Item label="School SCI-TECH" value="School SCI-TECH" />
              </Select> */}
                <Input
                  size="md"
                  placeholder="Input Weight Volume Here..."
                  type="text"
                  bg={"white"}
                  onChangeText={handleChange("weight")}
                  value={values.weight}
                />
                {errors.weight && touched.weight && (
                  <Text style={{ fontSize: 10, color: "red" }}>
                    {errors.weight}
                  </Text>
                )}
              </Stack>
              <Button
                colorScheme="danger"
                mt={5}
                mb={2}
                leftIcon={
                  <Icon
                    as={<MaterialIcons name="send" />}
                    color={"white"}
                    size={5}
                  />
                }
                isDisabled={isDisabled}
                onPress={handleSubmit}
              >
                Submit
              </Button>
            </Center>
          </VStack>
        </ScrollView>
      </View>
      {loading ? <ActivityIndicator /> : <></>}
    </>
  );
};
export default InputGarbageWeightPage;
