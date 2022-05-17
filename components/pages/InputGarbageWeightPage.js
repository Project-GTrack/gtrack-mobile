import React, { useState, useEffect} from "react";
import {
  Text,
  Image,
  Button,
  Center,
  Input,
  ScrollView,
  Icon,
  Stack,
  VStack,
  View,
  HStack,
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import GtrackMainLogo from "../../assets/gtrack-logo-1.png";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormik } from "formik";
import axios from "axios";
import envs from "../../config/env.js";
import MessageAlert from "../helpers/MessageAlert";
import ActivityIndicator from "../helpers/ActivityIndicator";
import moment from "moment";
import Firebase from "../helpers/Firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as yup from "yup";
const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
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
  const collectionValidation = yup.object().shape({
    weight: yup.string().required("Weight Volume is required"),
    date: yup.string().required("Date is required"),
    time: yup.string().required("Time is required"),
    // schedule: yup.object().shape({
    //   date: yup.string().required("Date is required"),
    //   time: yup.string().required("Time is required"),
    // }),
  });
  const handleDumpsterUpdate=async (dumpster_id)=>{
    await db.ref("Dumpsters/" + dumpster_id).child("complete").set(0);
    await db.ref("Dumpsters/" + dumpster_id)
      .child("driver_id")
      .remove();
  }
  const handleFormSubmit = async (values, { resetForm }) => {
    setLoading(true);
    if(new Date(moment(moment(values.date).format("YYYY-MM-DD").toString()+" "+moment(values.time.toString().substring(16,24), ["HH:mm:ss"]).format("HH:mm:ss")).toISOString()) <= new Date()){
      await axios
      .post(
        `${envs.BACKEND_URL}/mobile/waste-collection/submit-collection/${user.user_id}`,
        {
          collection_weight_volume: values.weight,
          collection_date: moment(moment(values.date).format("YYYY-MM-DD").toString()+" "+moment(values.time.toString().substring(16,24), ["HH:mm:ss"]).format("HH:mm:ss")).toISOString(),
          collection_route: route,
        }
      )
      .then((res) => {
        if (res.data.success) {
          db.ref("Dumpsters/").once("value", (snapshot) => {
            if(snapshot.val()){
              var temp=Object.keys(snapshot.val()).map((key) => snapshot.val()[key]);
              for (var x = 0; x < temp.length; x++) {
                if (temp[x] !== undefined) {
                  if (temp[x].driver_id !== undefined && temp[x].driver_id === user.user_id) {
                    handleDumpsterUpdate(temp[x].dumpster_id);
                    axios.put(
                      `${envs.BACKEND_URL}/mobile/dumpster/update-dumpster/${
                        temp[x].dumpster_id
                      }`
                    );
                  }
                }
              }
            }
          });
          setLoading(false);
          resetForm();
          setAlert({
            visible: true,
            message: res.data.message,
            colorScheme: "success",
            header: "Waste Collection Report",
          });
        }
      });
    }else{
      await wait(2000).then(() => setLoading(false));
      setAlert({
        visible: true,
        message: "Invalid Date: Date must be the current date or a previous/past date.",
        colorScheme: "error",
        header: "Waste Collection Report",
      });
      resetForm();
    }
    
  };
  const { handleChange, handleSubmit, values, errors, touched, setFieldValue } =
    useFormik({
      initialValues: {
        weight: "",
        date: "",
        time:""
        // schedule: {
        //   date: "",
        //   time:""
        // },
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
        setFieldValue("date", moment(currentDate));
      } else {
        setFieldValue("time", moment(currentDate));
      }
    }
  };
  const showPicker = (mode) => {
    setShow(true);
    if (mode === "time") {
      setMode("time");
      setCurShow(mode);
    } else {
      setMode(mode);
      setCurShow(mode);
    }
  }
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
                        values.date != ""
                          ? moment(values.date).format(
                              "MMMM D, Y"
                            )
                          : ""
                      }
                      onChangeText={handleChange("date")}
                      placeholder="Date"
                      isReadOnly="true"
                      isDisabled="true"
                    />
                    {errors.date && touched.date && (
                      <Text style={{ fontSize: 10, color: "red" }}>
                        {errors.date}
                      </Text>
                    )}
                  </VStack>
                  <VStack paddingRight={2}>
                    <Input
                      size="md"
                      bg={"white"}
                      width={120}
                      value={
                        values.time != ""
                          ? moment(values.time).format("h:mm A")
                          : ""
                      }
                      onChangeText={handleChange("time")}
                      placeholder="Time"
                      isReadOnly="true"
                      isDisabled="true"
                    />
                    {errors.time && touched.time && (
                      <Text style={{ fontSize: 10, color: "red"}}>
                        {errors.time}
                      </Text>
                    )}
                  </VStack>
                </HStack>

                <Center>
                  <HStack>
                    <VStack paddingRight={15} marginLeft={2}>
                      <Button
                        onPress={() => showPicker("date")}
                        colorScheme="success"
                        title="Show date picker!"
                      >
                        Select Date
                      </Button>
                    </VStack>
                    <VStack paddingRight={2}>
                      <Button
                        onPress={() => showPicker("time")}
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
                <Input
                  size="md"
                  placeholder="Input Weight Volume Here..."
                  keyboardType="numeric"
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
