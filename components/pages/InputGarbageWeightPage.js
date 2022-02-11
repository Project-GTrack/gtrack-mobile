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
import { useFormik } from 'formik';
import axios from 'axios';
import envs from '../../config/env.js';
import MessageAlert from '../helpers/MessageAlert';
import ActivityIndicator from '../helpers/ActivityIndicator';
import moment from "moment";
import Firebase from "../helpers/Firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
const db=Firebase.app().database();
const InputGarbageWeightPage = () => {
  const [date, setDate] = useState("");
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [curShow, setCurShow] = useState("");
  const [loading,setLoading]=useState(false);
  const [user,setUser]=useState({});
  const [route,setRoute]=useState("");
    useEffect(() => {
         getData();
      }, []);
  const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@user');
            if(value!==null){
                setUser(JSON.parse(value));
            }else{
                setUser(null);
            }
        }catch (e){
            console.log(e);
        }
    }
    const handleFormSubmit = async (values,{resetForm}) =>{
      if (values.weight !== '' && route != "" && date != "" && startTime != "") {
          setLoading(true);
          axios.post(`${envs.BACKEND_URL}/mobile/waste-collection/submit-collection/${user.user_id}`, {collection_weight_volume:values.weight,collection_date:date+" "+startTime,collection_route:route})
          .then(res => {
              if(res.data.success){
                  db.ref("Dumpsters/").once('value', (snapshot) => {
                    for(var x = 0; x < snapshot.val().length;x++){
                      if(snapshot.val()[x] != undefined){
                        if(snapshot.val()[x].driver_id != undefined && snapshot.val()[x].driver_id === user.user_id){
                          db.ref("Dumpsters/"+snapshot.val()[x].dumpster_id).update({complete: 0});
                          db.ref("Dumpsters/"+snapshot.val()[x].dumpster_id).child("driver_id").remove();
                          axios.put(`${envs.BACKEND_URL}/mobile/dumpster/update-dumpster/${snapshot.val()[x].dumpster_id}`);
                        }
                      }
                      
                    }
                  })
                  resetForm();
                  setDate("");
                  setStartTime("");
                  setRoute("");
                  setLoading(false);
                  setAlert({visible:true,message:res.data.message,colorScheme:"success",header:"Waste Collection Report"});
              }
          })
      }else{
        resetForm();
        setDate("");
        setStartTime("");
        setRoute("");
        setLoading(false);
        setAlert({visible:true,message:"Please fill out all the fields",colorScheme:"danger",header:"Empty Fields"});
      }
  }
  const { handleChange, handleSubmit, values } = useFormik({
      initialValues:{ weight:'', route:'' },
      enableReinitialize:true,
      onSubmit: handleFormSubmit
  });
  const [alert,setAlert]=useState({
      visible:false,
      message:null,
      colorScheme:null,
      header:null
  });

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    console.log(new Date(currentDate).toISOString());
    if(curShow === "date"){
      setDate(currentDate.toISOString().split('T')[0]);
    }else if(curShow === "StartTime"){
      setStartTime(currentDate.toString().substring(16,24));
    }
    
    console.log(Platform.OS);
    console.log(date);
  };

  const showMode = (currentMode) => {
    setShow(true);
    if(currentMode === "StartTime"){
      setMode("time");
      setCurShow(currentMode);
    }else{
      setMode(currentMode);
      setCurShow(currentMode);
    }
  
    
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showStartTimepicker = () => {
    showMode("StartTime");
  };
  return (
    <>
    <View>
      <MessageAlert alert={alert} setAlert={setAlert}/>
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
                <VStack paddingRight={5}>
                <Input size="md" isRequired width={175} bg={"white"} value={date != ""? moment(date.toString()).format('MMMM D, Y'):date.toString()} placeholder="Date" isReadOnly="true" isDisabled="true"/>
                </VStack>
                <VStack paddingRight={2}>
                <Input size="md" isRequired width={75} bg={"white"} value={startTime.toString().substring(0,5)} placeholder="Time" isReadOnly="true" isDisabled="true"/>
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
                      Set Date
                    </Button>
                  </VStack>
                  <VStack paddingRight={2}>
                    <Button
                      onPress={showStartTimepicker}
                      colorScheme="success"
                      title="Show time picker!"
                    >
                      Set Time
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

              <Select
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
              </Select>
              <Input
                size="md"
                placeholder="Input Weight Volume Here..."
                type="text"
                bg={"white"}
                isRequired
                onChangeText={handleChange('weight')}
                value={values.weight}
              />
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
              onPress={handleSubmit}
            >
              Submit
            </Button>
          </Center>
        </VStack>
      </ScrollView>
    </View>
    {loading?(<ActivityIndicator/>):(<></>)}
    </>
  );
};
export default InputGarbageWeightPage;
