import React, { useEffect, useState } from 'react'
import {
    Text,
    Image,
    Button,
    Center,
    Input,
    Divider,
    Link,
    Box,
    Stack,
    ScrollView,
    HStack
  } from "native-base";
import GtrackMainLogo from '../../assets/gtrack-logo-1.png'
import GoogleIcon from '../../assets/google-icon.png'
import axios from 'axios';
import { useFormik } from 'formik';
import Firebase from '../helpers/Firebase';
import MessageAlert from '../helpers/MessageAlert';
import ActivityIndicator from '../helpers/ActivityIndicator';
import envs from '../../config/env.js'
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup'

const auth = Firebase.auth();
const ForgotPasswordPage = ({navigation}) => {
    const [loading,setLoading]=useState(false);
    const [user,setUser]=useState(null);
    const forgotPasswordValidationSchema = yup.object().shape({
        email: yup
          .string()
          .email("Please enter valid email")
          .required('Email Address is Required')
    })
    const [alert,setAlert]=useState({
        visible:false,
        message:null,
        colorScheme:null,
        header:null
    });
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
    const handleCreateFirebase=async(email)=>{
        await auth.createUserWithEmailAndPassword(email,"p@ssw0rd");
        await auth.sendPasswordResetEmail(email);
        setAlert({visible:true,message:"An email to reset your password has been sent!",colorScheme:"success",header:"Password Reset"});
    }
    const handleFormSubmit = async (values,{resetForm}) =>{
        setLoading(true);
        axios.post(`${envs.BACKEND_URL}/mobile/reset_password`, {email:values.email})
        .then(res => {
            if(res.data.success){
                auth.sendPasswordResetEmail(values.email)
                .then(() => {
                    setLoading(false);
                    setAlert({visible:true,message:"An email to reset your password has been sent!",colorScheme:"success",header:"Password Reset"})
                }, error => {
                    setLoading(false);
                    if(error.code=="auth/user-not-found"){
                        handleCreateFirebase(values.email);
                    }else{
                        setAlert({visible:true,message:error.message,colorScheme:"danger",header:"Error"})
                    }
                });
            }else{
                setLoading(false);
                setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"})
            }
        })
    }
    const { handleChange, handleSubmit,handleBlur, values,errors,isValid,touched } = useFormik({
        initialValues:{ email: '' },
        enableReinitialize:true,
        validationSchema:forgotPasswordValidationSchema,
        onSubmit: handleFormSubmit
    });
    
    useEffect(() => {
        isFocused = navigation.addListener('focus',getData);
        if(user){
            navigation.replace('Drawer');
        }
        return ()=>{
            isFocused=null;
        }
    },[user]);
    return (
        <>
            <ScrollView>
            <MessageAlert alert={alert} setAlert={setAlert}/>
                <Center
                    px={3}
                    mt={10}
                >
                    <Image
                        size={200}
                        resizeMode={"contain"}
                        source={GtrackMainLogo}
                        alt="GTrack Logo"
                    />
                    <Text
                        mb={2}
                        fontSize={"xl"}
                        color={"gray.600"}
                    >
                        Forgot Password
                    </Text>
                    <Text
                        mb={5}
                        fontSize={"md"}
                        color={"gray.600"}
                    >
                        Enter your email to receive the reset link.
                    </Text>
                </Center>
                <Center
                    px={3}
                    mb={2}
                >
                    <Stack space={3} alignItems="center">
                        <Input keyboardType="email-address" autoCapitalize="none" size="md" width="300" placeholder="Email Address" 
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        {(errors.email && touched.email) &&
                            <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
                        }
                        <HStack>
                            <Text color={"gray.600"} >Remembered your password?</Text>
                            <Link ml={1}
                                onPress={() =>
                                    navigation.navigate('SignInPage')
                                } 
                                isUnderlined 
                                _text={{
                                    color: "primary.500",
                                }}
                            >
                                Click Here
                            </Link>
                        </HStack>
                        
                        <Button width="300" colorScheme="success" 
                            onPress={handleSubmit}
                            disabled={!isValid}
                        >Send</Button>
                    </Stack>
                </Center>
            </ScrollView>
            {loading?(<ActivityIndicator/>):(<></>)}
        </>
    )
}

export default ForgotPasswordPage
