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
import * as Google from 'expo-google-app-auth';
import * as firebase from "firebase";
import 'firebase/auth';

const auth = Firebase.auth();
const SignInPage = ({navigation}) => {
    const [loading,setLoading]=useState(false);
    const [user,setUser]=useState(null);
    const signinValidationSchema = yup.object().shape({
        email: yup
          .string()
          .email("Please enter valid email")
          .required('Email Address is Required'),
        password: yup
          .string()
          .required('Password is required'),
    })
    const setData = async (data) => {
        try {
            const jsonValue = JSON.stringify(data)
            await AsyncStorage.setItem('@user', jsonValue)
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
    const createAlert = (auth) =>{
        Alert.alert(
        "Error",
        "Email not verified. Do you want to send another verification link?",
        [
            {
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            },
            { text: "Yes", onPress: () => {auth.currentUser.sendEmailVerification()} }
        ]
        );
    }
    const handleFirebase = async(data,values,resetForm)=>{
        await auth.signInWithEmailAndPassword(values.email, values.password)
        .then(function() {
            setLoading(false);
            if(auth.currentUser.emailVerified){
                resetForm();
                setData(data);
            }else{
                createAlert(auth);
            }
        })
        .catch(function(error) {
            setLoading(false);
            setAlert({visible:true,message:error.message,colorScheme:"danger",header:`Error`});
        });
    }
    const handleFormSubmit = async (values,{resetForm}) =>{
        setLoading(true);
        axios.post(`${envs.BACKEND_URL}/mobile/login`, {email:values.email,password:values.password})
        .then(res => {
            if(res.data.success){
                handleFirebase(res.data.data,values,resetForm);
            }else{
                setLoading(false);
                setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"})
            }
        })
    }
    const { handleChange, handleSubmit,handleBlur, values,errors,isValid,touched } = useFormik({
        initialValues:{ email: '',password:'' },
        enableReinitialize:true,
        validationSchema:signinValidationSchema,
        onSubmit: handleFormSubmit
    });
    const [alert,setAlert]=useState({
        visible:false,
        message:null,
        colorScheme:null,
        header:null
    });
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
        axios.post(`${envs.BACKEND_URL}/mobile/login`, {email:user.email,lname:user.familyName,fname:user.givenName,image:user.photoUrl,google_auth:true})
        .then(res => {
            if(res.data.success){
                setLoading(false);
                handleFirebaseGoogle(idToken,accessToken,res);
            }else{
                setLoading(false);
                signOutAsync(accessToken);
                setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"});
            }
        })
    }
    
    const signInAsync = async () => {
    //     try {
    //       await GoogleSignIn.askForPlayServicesAsync();
    //       const { type, user } = await GoogleSignIn.signInAsync();
    //       if (type === 'success') {
    //         getUserInfo(user);
    //       }else{
    //         setLoading(false);
    //       }
    //     } catch ({ message }) {
    //         setAlert({visible:true,message:message,colorScheme:"danger",header:`Error`});
    //     }
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
    //     initAsync()
    // }, []);
    useEffect(() => {
        isFocused = navigation.addListener('focus',getData);
        if(user){
            navigation.replace('Drawer');
        }
        return ()=>{
            isFocused=null;
        }
    },[user]);

    const handleGoogleClick = async () => {
        setLoading(true);
        signInAsync();
    }
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
                        mb={5}
                        fontSize={"xl"}
                        color={"gray.600"}
                    >
                        Sign in with
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
                        {(errors.email && touched.email) &&
                            <Text style={{ fontSize: 10, color: 'red' }}>{errors.email}</Text>
                        }
                        <Input keyboardType="email-address" autoCapitalize="none" size="md" width="300" placeholder="Email Address" 
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        
                        {(errors.password && touched.password) &&
                            <Text style={{ fontSize: 10, color: 'red' }}>{errors.password}</Text>
                        }
                        <Input size="md" type='password' width="300" placeholder="Password" isFullWidth={true}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                        />
                        <HStack>
                        <Text color={"gray.600"} >Don't have an account yet?</Text>
                        <Link ml={1}
                            onPress={() =>
                                navigation.navigate('SignUpPage')
                            } 
                            isUnderlined 
                            _text={{
                                color: "primary.500",
                            }}
                        >
                            Click Here
                        </Link>
                        </HStack>
                        <Link
                            onPress={() =>
                                navigation.navigate('ForgotPasswordPage')
                            } 
                            isUnderlined 
                            _text={{
                                color: "primary.500",
                            }}
                        >
                            Forgot Password?
                        </Link>
                        <Button width="300" colorScheme="success" 
                            onPress={handleSubmit}
                            disabled={!isValid}
                        >Sign in</Button>
                    </Stack>
                </Center>
            </ScrollView>
            {loading?(<ActivityIndicator/>):(<></>)}
        </>
    )
}

export default SignInPage
