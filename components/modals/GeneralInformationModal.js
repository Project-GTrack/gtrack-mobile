import React,{useEffect, useState} from "react"
import {
  Button,
  Modal,
  Input,
  Text,
  Icon,
  Stack,
  Select,
  CheckIcon,
  HStack
} from "native-base"
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { MaterialIcons } from "@expo/vector-icons"
import axios from 'axios';
import { useFormik } from 'formik';
import envs from '../../config/env.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup'

const GeneralInformationModal = ({setAlert,user,showModal,setShowModal}) => {
  const [loading,setLoading]=useState(false);
  const [initialValues,setInitialValues]=useState(null);
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(new Date(moment()));
  const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
  };
  const generalInfoValidationSchema = yup.object().shape({
    fname: yup
      .string()
      .required('First Name is Required'),
    lname: yup
      .string()
      .required('Last Name is Required'),
    contact_no: yup
      .string()
      .min(11,`Must be 11 digits starting with 09`)
      .max(11,`Must be 11 digits starting with 09`)
  })
  const setData = async (data) => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@user', jsonValue);
    } catch (e) {
        setAlert({visible:true,message:e,colorScheme:"danger",header:"Error"});
    }
  }
  const handleFormSubmit = async (values) =>{
    setLoading(true);
    axios.post(`${envs.BACKEND_URL}/mobile/profile/general_info`, {email:values.email,lname:values.lname,fname:values.fname,contact_no:values.contact_no!==""?values.contact_no:null,gender:values.gender!==""?values.gender:null,birthday:date})
    .then(res => {
        setLoading(false);
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
  useEffect(() => {
    if(user){
      setInitialValues({
        email:user.email?user.email:"",
        fname:user.fname?user.fname:"",
        lname:user.lname?user.lname:"",
        gender:user.gender?user.gender:"",
        contact_no:user.contact_no?user.contact_no:"",
        birthday:user.birthday?user.birthday:""
      })
      if(user.birthday){
        setDate(new Date(moment(user.birthday)));
      }
    };
    
  }, [user]);
  const { handleChange, handleSubmit, values,errors,isValid,touched } = useFormik({
    initialValues:initialValues,
    enableReinitialize:true,
    validationSchema:generalInfoValidationSchema,
    onSubmit: handleFormSubmit
  });
  return (
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>General Information</Modal.Header>
        <Modal.Body>
            <Stack  style={{alignSelf:'stretch'}}>
                {(errors.fname && touched.fname) &&
                  <Text style={{ fontSize: 10, color: 'red' }}>{errors.fname}</Text>
                }
                {(errors.lname && touched.lname) &&
                  <Text style={{ fontSize: 10, color: 'red' }}>{errors.lname}</Text>
                }
                <HStack space={1}>
                  <Input autoCapitalize="words" value={values&&values.fname?values.fname:""} placeholder="First Name" onChangeText={handleChange('fname')} style={{alignSelf:'stretch',width:'50%'}}/>
                  <Input autoCapitalize="words" value={values&&values.lname?values.lname:""} placeholder="Last Name" onChangeText={handleChange('lname')} style={{alignSelf:'stretch',width:'50%'}}/>
                </HStack>
                <Input keyboardType="email-address" value={values&&values.email?values.email:""} placeholder="email" onChangeText={handleChange('email')} isDisabled mt={2} style={{alignSelf:'stretch'}}/>
                <Input keyboardType="numeric" value={values&&values.contact_no?values.contact_no:""} placeholder="Contact Number" onChangeText={handleChange('contact_no')} mt={2} style={{alignSelf:'stretch'}}/>
                <Select
                  accessibilityLabel="Choose Gender"
                  placeholder="Choose Gender"
                  _selectedItem={{
                      bg: "success.500",
                      endIcon: <CheckIcon size="5" />,
                  }}
                  selectedValue={values&&values.gender?values.gender:""}
                  dropdownIcon={
                      <Icon
                      as={<MaterialIcons name="unfold-more" />}
                      color={'#10b981'}
                      size={7}
                      />
                  }
                  mt={2}
                  style={{
                      borderWidth: 1,
                      borderColor: '#10b981',
                      width:500
                  }}
                  onValueChange={handleChange('gender')}
                >
                  <Select.Item label="Male" value="Male" />
                  <Select.Item label="Female" value="Female" />
                </Select>
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
            </Stack>
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
              isLoading={loading}
              isLoadingText="Updating"
              onPress={handleSubmit}
              disabled={!isValid}
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
