import React, { useState, useEffect } from "react";
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
import { useFormik } from 'formik';
import axios from 'axios';
import envs from '../../config/env.js';
import MessageAlert from '../helpers/MessageAlert';
import ActivityIndicator from '../helpers/ActivityIndicator';
import GoogleIcon from "../../assets/google-icon.png";
import { SliderBox } from "react-native-image-slider-box";
import AsyncStorage from '@react-native-async-storage/async-storage';

const EventModal = (props) => {
  const [user,setUser]=useState({});
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
      if (values.password !== '') {
          setLoading(true);
          axios.post(`${envs.BACKEND_URL}/mobile/event/join-event/${props.id}`, {email:user.email,password:values.password})
          .then(res => {
              if(res.data.success){
                  resetForm();
                  props.setShowModal(false);
                  setAlert({visible:true,message:res.data.message,colorScheme:"success",header:"Event Joined"});
              }else{
                  resetForm();
                  props.setShowModal(false);
                  setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Password Invalid"});
              }
          })
          
      }
  }
  const { handleChange, handleSubmit, values } = useFormik({
      initialValues:{ password:'' },
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
      <Modal isOpen={props.showModal} onClose={() => props.setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header><Text bold>Do you want to join {props.title}?</Text></Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Confirm using your password</FormControl.Label>
              <Input isRequired type='password' placeholder="Password"
                        onChangeText={handleChange('password')}
                        value={values.password}
                    />
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  props.setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={handleSubmit}
              >
                Join
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      </View>
    </>
  );
};

export default EventModal;
