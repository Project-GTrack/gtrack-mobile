import React, { useEffect,useState,useRef } from "react"
import {
  Button,
  Modal,
  FormControl,
  Input,
  Text
} from "native-base"
import axios from 'axios';
import { useFormik } from 'formik';
import envs from '../../config/env.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup'

const ChangeAddressModal = ({setAlert,user,showModal,setShowModal}) => {
  const streetRef=useRef();
  const barangayRef=useRef();
  const changeAddressValidationSchema = yup.object().shape({
    purok: yup
      .string()
      .required('Purok is required'),
    street: yup
      .string()
      .required('Street is required'),
    barangay: yup
      .string()
      .required('Barangay is required'),
  })
  const [loading,setLoading]=useState(false);
  const [initialValues, setInitialValues] = useState(null);
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
    axios.post(`${envs.BACKEND_URL}/mobile/profile/address`, {email:values.email,purok:values.purok!==""?values.purok:null,street:values.street!==""?values.street:null,barangay:values.barangay!==""?values.barangay:null})
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
        purok:user.purok?user.purok:"",
        street:user.street?user.street:"",
        barangay:user.barangay?user.barangay:"",
      })
    };
    
  }, [user]);
  const { handleChange, handleBlur, handleSubmit, values, errors, isValid, touched } = useFormik({
    initialValues:initialValues,
    enableReinitialize:true,
    validationSchema:changeAddressValidationSchema,
    onSubmit: handleFormSubmit
  });
  return (
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Change Address</Modal.Header>
        <Modal.Body>
          <FormControl>
            <FormControl.Label>Purok</FormControl.Label>
            <Input 
              autoCapitalize="words" 
              value={values&&values.purok?values.purok:""} 
              returnKeyType="next" 
              blurOnSubmit={false}
              onSubmitEditing={() => streetRef.current.focus()}
              onChangeText={handleChange('purok')}
              onBlur={handleBlur('purok')}
            />
          </FormControl>
          {(errors.purok && touched.purok) &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.purok}</Text>
          }
          <FormControl mt="3">
            <FormControl.Label>Street</FormControl.Label>
            <Input 
              autoCapitalize="words" 
              value={values&&values.street?values.street:""} 
              returnKeyType="next" 
              blurOnSubmit={false}
              onSubmitEditing={() => barangayRef.current.focus()}
              ref={streetRef}
              onChangeText={handleChange('street')}
              onBlur={handleBlur('street')}
            />
          </FormControl>
          {(errors.street && touched.street) &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.street}</Text>
          }
          <FormControl mt="3">
            <FormControl.Label>Barangay</FormControl.Label>
            <Input 
              autoCapitalize="words" 
              ref={barangayRef}
              value={values&&values.barangay?values.barangay:""} 
              onChangeText={handleChange('barangay')}
              onBlur={handleBlur('barangay')}
            />
          </FormControl>
          {(errors.barangay && touched.barangay) &&
              <Text style={{ fontSize: 10, color: 'red' }}>{errors.barangay}</Text>
          }
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

export default ChangeAddressModal
