import React, { useEffect, useState } from "react";
import {
  Text,
  Image,
  Button,
  Center,
  Input,
  Divider,
  Icon,
  Badge,
  Box,
  Link,
  ScrollView,
  FormControl,
  VStack,
  HStack,
  View,
  TextArea,
  Slider,
  Avatar,
} from "native-base";
import { StyleSheet, LogBox } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import envs from "../../../config/env";
import PickImage from "../../helpers/PickImage";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { useFormik } from 'formik';
import Firebase from "../../helpers/Firebase";
import { uuidGenerator } from '../../helpers/uuidGenerator.js';
import moment from "moment";
import axios from "axios";
import MessageAlert from '../../helpers/MessageAlert';
import ActivityIndicator from '../../helpers/ActivityIndicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup'
const db=Firebase.app().database();
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
  const [onChangeValue,setOnChangeValue]=useState(1);
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
  const reportValidationSchema = yup.object().shape({
      subject: yup
        .string()
        .required('Subject is required'),
      description: yup
        .string()
        .required('Description is required'),
      images: yup
        .array()
        .min(1,"Attach atleast 1 image")
        .required('Attach atleast 1 image'),
  })
  const handleRemoveImage=(index)=>{
    let imgTemp=[...images];
    imgTemp.splice(index,1);
    setImages([...imgTemp]);
  }
  const handleFormSubmit = async (values,{resetForm}) => {
    try{
      setLoading(true);
        axios.post(`${envs.BACKEND_URL}/mobile/report/submit-report/${user.user_id}`, {subject:values.subject,message:values.description,latitude:initLoc.latitude,longitude:initLoc.longitude,degree:degree.level,image:images})
          .then(res => {
              if(res.data.success){
                db.ref('Reports/'+user.user_id).set({
                  subject: values.subject,
                  description: values.description,
                  degree: degree.level,
                  report_id:res.data.data.report_id,
                  active: 1,
                  sender:user.fname+" "+user.lname,
                  sender_image:user.image,
                  coordinates: {
                    latitude: initLoc.latitude,
                    longitude: initLoc.longitude,
                  },
                  imageDownloadURL:images                
                })
                resetForm();
                setOnChangeValue(1);
                setImages([]);
                setLoading(false);
                setAlert({visible:true,message:res.data.message,colorScheme:"success",header:"Report Submission"});
              }else{
                setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"})
              }
          })
      
    }catch(e){
      console.log(e);
    }
 
  }
  const { handleChange, handleSubmit, handleBlur, values, errors, touched, setFieldValue } = useFormik({
    initialValues:{ subject:'', description:'', images: []},
    enableReinitialize:true,
    validationSchema:reportValidationSchema,
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
          {(errors.subject && touched.subject) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.subject}</Text>
                }
            <Input autoCapitalize="sentences" bgColor="white" onBlur={handleBlur('subject')} placeholder="Subject" onChangeText={handleChange('subject')}
                value={values&&values.subject?values.subject:""}/>
          </FormControl>
          <FormControl paddingBottom={5}>
          {(errors.description && touched.description) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.description}</Text>
                }
            <TextArea
              h={200}
              bgColor={"white"}
              autoCapitalize="sentences"
              placeholder="Write description here ..."
              onBlur={handleBlur('description')}
              style={{
                textAlignVertical: "top",
                fontSize: 14,
              }}
              p={3}
              onChangeText={handleChange('description')}
                value={values&&values.description?values.description:""}
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
              {(errors.images && touched.images) &&
                    <Text style={{ fontSize: 10, color: 'red' }}>{errors.images}</Text>
                }
              <PickImage path={path} value={images} setValue={setImages} multiple={true} setFieldValue={setFieldValue}/>
              <Center marginTop={3}>
                    <HStack space={2}>
                    {images.map((img,i)=>{
                       return  (
                        <Box rounded={'full'} key={i}>
                          <Avatar 
                            size="md"
                            backgroundColor="white"
                            source={{uri: img}}
                          />
                            {/* <Image
                                size={50}
                                resizeMode={"contain"}
                                source={{uri: img}}
                                alt="Concern Photo"
                                rounded={'full'}
                            /> */}
                            <Link onPress={()=>handleRemoveImage(i)} style={{position:'absolute',right:0,marginRight:-10,top:0,marginTop:-5}}>
                                <Badge colorScheme="danger" rounded={'full'}>X</Badge>
                            </Link>
                        </Box>
                        
                    );
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
