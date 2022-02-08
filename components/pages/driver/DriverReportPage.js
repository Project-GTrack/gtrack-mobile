import React, { useEffect, useState } from "react";
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
import { StyleSheet, LogBox } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import envs from "../../../config/env";
import PickImage from "../../helpers/PickImage";
import * as Location from "expo-location";
import GtrackMainLogo from "../../../assets/gtrack-logo-1.png";
import * as ImagePicker from "expo-image-picker";
import { useFormik } from 'formik';
import GoogleIcon from "../../../assets/google-icon.png";
import Firebase from "../../helpers/Firebase";
import { uuidGenerator } from '../../helpers/uuidGenerator.js';
import moment from "moment";
import axios from "axios";
import MessageAlert from '../../helpers/MessageAlert';
import ActivityIndicator from '../../helpers/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DriverReportPage = () => {
  const [images,setImages]=useState([]);
  const [path,setPath]=useState(null);
  const [loading,setLoading]=useState(false);
  const [degree,setDegree]=useState({
    level:'',
    color:'',
  });
  const [user,setUser]=useState({});
  const [initLoc, setInitLoc] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [onChangeValue,setOnChangeValue]=useState(0);
  const [uri,setURI]=useState("");
  useEffect(() => {
    getData();
    setPath(`/gtrack-mobile/report/${uuidGenerator()}`);
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Linking.openURL("app-settings:");
        return;
      }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation, maximumAge: 10000});
      setInitLoc(prevState=>({...prevState,latitude:location.coords.latitude,longitude:location.coords.longitude}))
    })();
  }, [])
  useEffect(() => {
    if(onChangeValue == 0){
      setDegree({
        level: '',
        color: 'emerald',
      })
    }else if(onChangeValue == 1){
      setDegree({
        level: 'Low',
        color: 'emerald',
      })
    }else if( onChangeValue == 2){
      setDegree({
        level: 'Moderate',
        color: 'yellow',
      })
    }else{
      setDegree({
        level: 'High',
        color: 'red',
      })
    }
  }, [onChangeValue])
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
    
  
  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });
  //   console.log(result);
  //   if(result.cancelled === false){
  //     const img = await fetch(result.uri);
  //     const bytes = await img.blob();
  //     setURI(result.uri);
  //     setImage(bytes)
  //   }

  //   if (result.cancelled) {
  //     console.log("Cancelled");
  //   }
  // }
  const handleFormSubmit = async (values,{resetForm}) => {
    try{
      setLoading(true);
      if(values.subject != "" && values.description != "" && images.length != 0 && initLoc != null && degree != null){
        // let upload = await Firebase.app().storage("gs://gtrack-339307.appspot.com")
        // .ref("/gtrack-mobile/concern/" + uri.split("/").pop()).put(image);
        // let downURL = await Firebase.app().storage("gs://gtrack-339307.appspot.com")
        // .ref("/gtrack-mobile/concern/" + uri.split("/").pop()).getDownloadURL();
        // console.log(downURL);
        Firebase.app().database('https://gtrack-339307-default-rtdb.asia-southeast1.firebasedatabase.app/')
                .ref('Reports/'+user.user_id).set({
                  subject: values.subject,
                  description: values.description,
                  degree: degree.level,
                  active: 1,
                  coordinates: {
                    latitude: initLoc.latitude,
                    longitude: initLoc.longitude,
                  },
                  imageDownloadURL:images                
                })
        axios.post(`${envs.BACKEND_URL}/mobile/report/submit-report/${user.user_id}`, {subject:values.subject,message:values.description,latitude:initLoc.latitude,longitude:initLoc.longitude,degree:degree.level,image:images})
          .then(res => {
              if(res.data.success){
                resetForm();
                setOnChangeValue(0);
                setImages([]);
                setLoading(false);
                setAlert({visible:true,message:res.data.message,colorScheme:"success",header:"Report Submission"});
              }
          })
      }else{
        resetForm();
        setOnChangeValue(0);
        setImages([]);
        setLoading(false);
        setAlert({visible:true,message:"Please fill out all the fields",colorScheme:"danger",header:"Empty Fields"});
      }
      
    }catch(e){
      console.log(e);
    }
 
  }
  const { handleChange, handleSubmit, values } = useFormik({
    initialValues:{ subject:'', description:'' },
    enableReinitialize:true,
    onSubmit: handleFormSubmit
});
const [alert,setAlert]=useState({
  visible:false,
  message:null,
  colorScheme:null,
  header:null
});
  
  

  return (
    <>
    <View>
      <MessageAlert alert={alert} setAlert={setAlert}/>
      <ScrollView>
        <VStack px={4} pb={4} mt={5}>
          <FormControl paddingBottom={5}>
            <Input bgColor="white" isRequired placeholder="Subject" onChangeText={handleChange('subject')}
                value={values.subject}/>
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
              onChangeText={handleChange('description')}
                value={values.description}
            />
          </FormControl>
          <Divider />
          <FormControl>
            <HStack>
              <VStack>
                <FormControl.Label>Degree</FormControl.Label>
              </VStack>
              <VStack width="250">
                <Slider colorScheme={degree.color} maxValue={3} value={onChangeValue} onChange={v => setOnChangeValue(Math.floor(v))}>
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
                  value={initLoc.latitude.toString()}
                />
              </VStack>
              <VStack minWidth="100">
                <Input
                  h={8}
                  borderColor="black"
                  isReadOnly="true"
                  isDisabled="true"
                  value={initLoc.longitude.toString()}
                />
              </VStack>
            </HStack>
          </FormControl>
          <FormControl>
            <HStack mt={2}>
              <VStack minWidth="100">
              <PickImage path={path} value={images} setValue={setImages} multiple={true}/>
              <Center marginTop={3}>
                    <HStack>
                    {images.map((img,i)=>{
                        return  <Image key={i}
                                    size={50}
                                    resizeMode={"contain"}
                                    source={{uri: img}}
                                    alt="Concern Photo"
                                    rounded={'full'}
                                />
                        })
                    }
                    </HStack>
                </Center>
              </VStack>
            </HStack>
          </FormControl>

          <FormControl>
            <Button
              colorScheme="danger"
              mt={6}
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
              Send Report
            </Button>
          </FormControl>
        </VStack>
      </ScrollView>
    </View>
    {loading?(<ActivityIndicator/>):(<></>)}
    </>
  );
};

export default DriverReportPage;
