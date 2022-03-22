import React, { useState,useEffect } from 'react'
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
    HStack,
  } from "native-base";
import GtrackMainLogo from '../../assets/gtrack-logo-1.png'
import GoogleIcon from '../../assets/google-icon.png';
import { useFormik } from 'formik';
import Firebase from '../helpers/Firebase';
import MessageAlert from '../helpers/MessageAlert';
import ActivityIndicator from '../helpers/ActivityIndicator';
import CryptoES from "crypto-es";
import envs from '../../config/env.js'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as yup from 'yup'
import * as Google from 'expo-google-app-auth';
import * as firebase from "firebase";
import 'firebase/auth';

const auth = Firebase.auth();
const SignUpPage = ({navigation}) => {
    const [loading,setLoading]=useState(false);
    const signupValidationSchema = yup.object().shape({
        fname: yup
          .string()
          .required('First Name is Required'),
        lname: yup
          .string()
          .required('Last Name is Required'),
        email: yup
          .string()
          .email("Please enter valid email")
          .required('Email Address is Required'),
        password: yup
          .string()
          .min(8, ({ min }) => `Password must be at least ${min} characters`)
          .required('Password is required'),
        passwordRepeat: yup
          .string()
          .oneOf([yup.ref('password')], 'Passwords do not match')
          .required('Confirm password is required'),
    })
    const setData = async (data) => {
        try {
            const jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem('@user', jsonValue);
            navigation.replace('Drawer');
        } catch (e) {
            setAlert({visible:true,message:e,colorScheme:"danger",header:"Error"});
        }
    }
    const setAccessToken = async (data) => {
        try {
            const jsonValue = JSON.stringify(data)
            await AsyncStorage.setItem('@accessToken', jsonValue)
        } catch (e) {
            setAlert({visible:true,message:e,colorScheme:"danger",header:"Error"});
        }
    }
    const signOutAsync = async (accessToken) => {
        // await GoogleSignIn.signOutAsync();
        await Google.logOutAsync({ 
            accessToken:accessToken,
            clientId:  envs.EXPO_ANDROID_CLIENT_ID,
            androidStandaloneAppClientId:  envs.ANDROID_CLIENT_ID,
        });
    };
    const handleFirebaseGoogle= async (idToken,accessToken,res) => {
        const credential = firebase.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
        );
        await auth.signInWithCredential(credential);
        setAccessToken(accessToken);
        setData(res.data.data);
    }
    const getUserInfo= async (user,accessToken,idToken) =>{
        axios.post(`${envs.BACKEND_URL}/mobile/register`, {email:user.email,lname:user.familyName,fname:user.givenName,image:user.photoUrl,google_auth:true})
        .then(res => {
            if(res.data.success){
                setLoading(false);
                handleFirebaseGoogle(idToken,accessToken,res);
            }else{
                setLoading(false);
                signOutAsync(accessToken);
                setAlert({visible:true,message:"Account already existed.",colorScheme:"danger",header:"Error"});
            }
        })
    }
    
    const signInAsync = async () => {
        // try {
        //   await GoogleSignIn.askForPlayServicesAsync();
        //   const { type, user } = await GoogleSignIn.signInAsync();
        //   if (type === 'success') {
        //     getUserInfo(user);
        //   }else{
        //     setLoading(false);
        //   }
        // } catch ({ message }) {
        //     setAlert({visible:true,message:message,colorScheme:"danger",header:`Error`});
        // }
        const { type, accessToken, user,idToken } = await Google.logInAsync({
            clientId:  envs.EXPO_ANDROID_CLIENT_ID,
            androidStandaloneAppClientId:  envs.ANDROID_CLIENT_ID,
        });
        
        if (type === 'success') {
            /* `accessToken` is now valid and can be used to get data from the Google API with HTTP requests */
            getUserInfo(user,accessToken,idToken);
        }else{
            setLoading(false);
        }
    };
    // const initAsync = async () => {
    //     await GoogleSignIn.initAsync({
    //       // You may ommit the clientId when the firebase `googleServicesFile` is configured
    //       clientId: envs.ANDROID_CLIENT_ID,
    //     });
    // };
    // useEffect(() => {
    //     initAsync();
    // },[]);
    const handleGoogleClick = async () => {
        setLoading(true);
        signInAsync();
    }
    const handleFirebase =async (values,resetForm) =>{
        await auth.createUserWithEmailAndPassword(values.email, values.password)
        .then(function() {
            setLoading(false);
            auth.currentUser.sendEmailVerification();
            resetForm();
            setAlert({visible:true,message:"An email verification is sent!",colorScheme:"success",header:"Email Verification"})
        })
        .catch(function(error) {
            setLoading(false);
            setAlert({visible:true,message:error.message,colorScheme:"danger",header:`Error`});
        });
    }
    const handleFormSubmit = async (values,{resetForm}) =>{
        setLoading(true);
        const hashedPassword = CryptoES.AES.encrypt(values.password,envs.SECRET_KEY).toString();
        axios.post(`${envs.BACKEND_URL}/mobile/register`, {email:values.email,password:hashedPassword,lname:values.lname,fname:values.fname,user_type:values.user_type})
        .then(res => {
            if(res.data.success){
                handleFirebase(values,resetForm);
            }else{
                setLoading(false);
                setAlert({visible:true,message:"Account has already an existing record.",colorScheme:"danger",header:"Error"})
            }
        })
    }
    const { handleChange, handleSubmit,handleBlur, values,errors,isValid,touched } = useFormik({
        initialValues:{ email: '',fname:'',lname:'',password:'',passwordRepeat:'',user_type:'Resident' },
        enableReinitialize:true,
        validationSchema:signupValidationSchema,
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
        <ScrollView>
        <MessageAlert alert={alert} setAlert={setAlert}/>
        <Center
            mt={8}
        >
            <Image
                size={150}
                borderColor={"gray.500"}
                borderBottomRadius={"sm"}
                resizeMode={"center"}
                source={GtrackMainLogo}
                alt="GTrack Logo"
            />
            <Text
                mb={5}
                fontSize={"xl"}
                color={"gray.600"}
            >
                Sign up with
            </Text>
        </Center>
        <Center
            px={3}
            mb={2}
        >
            <Stack space={3} alignItems="center">
                <Link onPress={handleGoogleClick} >
                    <Box
                        size={12}
                        bg="gray.200"
                        rounded="full"
                    >
                        <Center p={2}>
                        <Image
                            size={8}
                            resizeMode={"contain"}
                            source={GoogleIcon}
                            alt="Google Icon"
                        />
                        </Center>
                    </Box>
                </Link>
                <Divider w="300" />
                    {(errors.fname && touched.fname) &&
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.fname}</Text>
                    }
                    {(errors.lname && touched.lname) &&
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.lname}</Text>
                    }
                    <HStack space={2}>
                        <Input autoCapitalize="words" isRequired size="md" width="148" placeholder="First Name" 
                            onChangeText={handleChange('fname')}
                            onBlur={handleBlur('fname')}
                            value={values.fname}
                        />
                        <Input autoCapitalize="words" isRequired size="md" width="148" placeholder="Last Name" 
                            onChangeText={handleChange('lname')}
                            onBlur={handleBlur('lname')}
                            value={values.lname}
                        />
                    </HStack>
                    {(errors.email && touched.email) &&
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
                    }
                    <Input keyboardType="email-address" autoCapitalize="none" size="md" isRequired width="300" placeholder="Email Address" 
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        value={values.email}
                    />
                    {(errors.password && touched.password) &&
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
                    }
                    <Input size="md" isRequired type='password' width="300" placeholder="Password" isFullWidth={true}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        value={values.password}
                    />
                    {(errors.passwordRepeat && touched.passwordRepeat) &&
                        <Text style={{ fontSize: 10, color: 'red' }}>{errors.passwordRepeat}</Text>
                    }
                    <Input size="md" isRequired type='password' width="300" placeholder="Repeat Password" isFullWidth={true}
                        onChangeText={handleChange('passwordRepeat')}
                        onBlur={handleBlur('passwordRepeat')}
                        value={values.passwordRepeat}
                    />
                    <HStack>
                        <Text color={"gray.600"} >Already have an account?</Text>
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
                    <Button width="300" colorScheme="success" onPress={handleSubmit} disabled={!isValid}>Sign Up</Button>
            </Stack>
        </Center>
        </ScrollView>
        {loading?(<ActivityIndicator/>):(<></>)}
        </>
    )
}

export default SignUpPage
