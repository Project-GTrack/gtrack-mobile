import React,{useEffect, useState} from "react"
import {
  Button,
  Modal,
  FormControl,
  Input,
  Center,
  VStack,
  Icon,
  HStack
} from "native-base"
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { MaterialIcons } from "@expo/vector-icons"
import axios from 'axios';
import { useFormik } from 'formik';
import envs from '../../config/env.js'
import AsyncStorage from '@react-native-async-storage/async-storage';

const GeneralInformationModal = ({alert,setAlert,user,showModal,setShowModal}) => {
    const [initialValues,setInitialValues]=useState(null);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(moment()));
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
    };
    const setData = async (data) => {
      try {
          const jsonValue = JSON.stringify(data);
          await AsyncStorage.setItem('@user', jsonValue);
      } catch (e) {
          setAlert({visible:true,message:e,colorScheme:"danger",header:"Error"});
      }
  }
    const handleFormSubmit = async (values) =>{
      if(values.fname!=""&&values.lname!=""){
        axios.post(`${envs.BACKEND_URL}/mobile/profile/general_info`, {email:values.email,lname:values.lname,fname:values.fname,contact_no:values.contact_no,birthday:date})
        .then(res => {
            if(res.data.success){
              setShowModal(false);
              setData(res.data.data)
              setAlert({visible:true,message:res.data.message,colorScheme:"success",header:"Success"});
            }else{
              setShowModal(false)
              setAlert({visible:true,message:"Update Unsuccessful.",colorScheme:"danger",header:"Error"})
            }
        })
      }
      
    }
    useEffect(() => {
      if(user){
        setInitialValues({
          email:user.email?user.email:"",
          fname:user.fname?user.fname:"",
          lname:user.lname?user.lname:"",
          contact_no:user.contact_no?user.contact_no:"",
          birthday:user.birthday?user.birthday:""
        })
        if(user.birthday){
          setDate(new Date(moment(user.birthday)));
        }
      };
      
    }, [user]);
    const { handleChange, handleSubmit, values } = useFormik({
      initialValues:initialValues,
      enableReinitialize:true,
      onSubmit: handleFormSubmit
    });
    return (
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>General Information</Modal.Header>
          <Modal.Body>
              <Center  style={{alignSelf:'stretch'}}>
                  <HStack space={1}>
                    <Input value={values&&values.fname?values.fname:""} placeholder="First Name" onChangeText={handleChange('fname')} style={{alignSelf:'stretch',width:'50%'}}/>
                    <Input value={values&&values.lname?values.lname:""} placeholder="Last Name" onChangeText={handleChange('lname')} style={{alignSelf:'stretch',width:'50%'}}/>
                  </HStack>
                  <Input value={values&&values.email?values.email:""} placeholder="email" onChangeText={handleChange('email')} isDisabled mt={2} style={{alignSelf:'stretch'}}/>
                  <Input value={values&&values.contact_no?values.contact_no:""} placeholder="Contact Number" onChangeText={handleChange('contact_no')} mt={2} style={{alignSelf:'stretch'}}/>
                  <Button 
                    leftIcon={ <Icon
                        as={<MaterialIcons name="cake" />}
                        color={'white'}
                        size={5}
                    />} 
                    colorScheme="success"
                    onPress={()=>setShow(true)} 
                    mt={2} 
                    style={{alignSelf:'stretch'}}
                  >
                    {moment(date).format('MMMM DD, YYYY')}
                  </Button>
                  {show && (
                    <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={'date'}
                    display="default"
                    onChange={onChange}
                    />
                )}
              </Center>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setShowModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={handleSubmit}
              >
                Update
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    )
}

export default GeneralInformationModal
