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
// import * as GoogleSignIn from 'expo-google-sign-in';
// import * as Google from 'expo-auth-session/providers/google';
import * as Google from 'expo-auth-session/providers/google';
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
    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId: envs.EXPO_CLIENT_ID,
        // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        androidClientId: envs.ANDROID_CLIENT_ID,
        // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    });
    const setData = async (data,sched) => {
        try {
            const firstPair = ["@user", JSON.stringify(data)]
            const secondPair = ["@schedule", JSON.stringify(sched)]
            await AsyncStorage.multiSet([firstPair, secondPair])
            navigation.replace('Drawer');
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
    const getUserInfo= async (token) =>{
        axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
        .then(res => {
            axios.post(`${envs.BACKEND_URL}/mobile/login`, {email:res.data.email,lname:res.data.family_name,fname:res.data.given_name,image:res.data.picture,google_auth:true})
            .then(res => {
                if(res.data.success){
                    setLoading(false);
                    setData(res.data.data,res.data.sched);
                }else{
                    setLoading(false);
                    setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"});
                }
            })
        })
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
    const handleFirebase = async(values,resetForm)=>{
        await auth.signInWithEmailAndPassword(values.email, values.password)
        .then(function() {
            auth.onAuthStateChanged(function(user) {
                if (user && user.emailVerified) {
                    setLoading(false);
                    resetForm({email: '',password:''});
                    axios.post(`${envs.BACKEND_URL}/mobile/verify_email`, {email:values.email})
                    .then(res=>{
                        if(res.data.success){
                            setData(res.data.data,res.data.sched);
                        }else{
                            setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"});
                        }
                    })
                    
                }else if(user && !user.emailVerified){
                    setLoading(false);
                    createAlert(auth);
                    // auth.currentUser.sendEmailVerification();
                    // setAlert({visible:true,message:"Email not verified. We sent you another verification link.",colorScheme:"danger",header:"Email Verification"});
                }
            });
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
            if(res.data.success && res.data.verified){
                setLoading(false);
                resetForm();
                setData(res.data.data);
            }else if(!res.data.success && !res.data.verified){
                setLoading(false);
                handleFirebase(values,resetForm);
                // setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"})
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
    // const getData = async () => {
    //     const value = await AsyncStorage.getItem('@user');
    //     return value!==null?JSON.parse(value):null;
    // }
    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication} = response;
            getUserInfo(authentication.accessToken);
        }else{
            setLoading(false);
        }
    }, [response]);
    
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
        promptAsync();
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
                        <Input size="md" width="300" placeholder="Email Address" 
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                        />
                        
                        {(errors.email && touched.password) &&
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
