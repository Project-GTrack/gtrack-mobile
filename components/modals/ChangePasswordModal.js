import React, { useEffect, useState } from "react"
import {
  Button,
  Modal,
  FormControl,
  Input,
  Center
} from "native-base"
import axios from 'axios';
import { useFormik } from 'formik';
import envs from '../../config/env.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoES from "crypto-es";
import Firebase from '../helpers/Firebase';

const auth = Firebase.auth();
const ChangePasswordModal = ({alert,setAlert,user,showModal,setShowModal}) => {
  const [initialValues, setInitialValues] = useState(null);
  const setData = async (data) => {
    try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem('@user', jsonValue);
    } catch (e) {
        setAlert({visible:true,message:e,colorScheme:"danger",header:"Error"});
    }
  }
  const decryptPassword=(password)=>{
    const decryptedPassword = CryptoES.AES.decrypt(password,envs.SECRET_KEY).toString(CryptoES.enc.Utf8);
    return decryptedPassword;
  }
  const encryptPassword=(password)=>{
    const encryptedPassword = CryptoES.AES.encrypt(password,envs.SECRET_KEY).toString();
    return encryptedPassword;
  }
  const handleFirebase = async(values,resetForm,data,message)=>{
    await auth.signInWithEmailAndPassword(values.email, values.old_password)
    .then(function(user) {
        if(user){
          auth.currentUser.updatePassword(values.new_password).then(function(){
            resetForm();
            setData(data)
            setAlert({visible:true,message:message,colorScheme:"success",header:"Success"});
          });
        }
    })
    .catch(function(error) {
        setAlert({visible:true,message:error.message,colorScheme:"danger",header:`Error`});
    });
}
  const handleFormSubmit = async (values,{resetForm}) =>{
    if(values.new_password===values.repeat_password){
      const decrypted=decryptPassword(user.password);
      console.log(decrypted);
      if(decrypted===values.old_password){
        const encrypted=encryptPassword(values.new_password)
        axios.post(`${envs.BACKEND_URL}/mobile/profile/change_password`, {email:values.email,password:encrypted})
        .then(res => {
            if(res.data.success){
              setShowModal(false);
              handleFirebase(values,resetForm,res.data.data,res.data.message);
              // setData(res.data.data)
              // setAlert({visible:true,message:res.data.message,colorScheme:"success",header:"Success"});
            }else{
              setShowModal(false)
              setAlert({visible:true,message:"Password Change Unsuccessful.",colorScheme:"danger",header:"Error"})
            }
        })
      }else{
        setShowModal(false)
        setAlert({visible:true,message:"Incorrect old password.",colorScheme:"danger",header:"Error"})
      }
    }else{
      setShowModal(false)
      setAlert({visible:true,message:"Password Mismatch.",colorScheme:"danger",header:"Error"})
    }
  }
  useEffect(() => {
    if(user){
      setInitialValues({
        email:user.email?user.email:"",
        old_password:"",
        new_password:"",
        repeat_password:"",
      })
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
          <Modal.Header>Change Password</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Current password</FormControl.Label>
              <Input type="password" value={values&&values.old_password?values.old_password:""} onChangeText={handleChange('old_password')}/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>New Password</FormControl.Label>
              <Input type="password" value={values&&values.new_password?values.new_password:""} onChangeText={handleChange('new_password')}/>
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Repeat New Password</FormControl.Label>
              <Input type="password" value={values&&values.repeat_password?values.repeat_password:""} onChangeText={handleChange('repeat_password')}/>
            </FormControl>
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

export default ChangePasswordModal
