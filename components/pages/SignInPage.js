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
const auth = Firebase.auth();

const SignInPage = ({navigation}) => {
    // const [user,setUser]=useState(null);
    // const initAsync = async () => {
    //     await GoogleSignIn.initAsync();
    //     _syncUserWithStateAsync();
    // };
    
    // const _syncUserWithStateAsync = async () => {
    //     const userG = await GoogleSignIn.signInSilentlyAsync();
    //     setUser(userG);
    // };
    // const signOutAsync = async () => {
    //     await GoogleSignIn.signOutAsync();
    //     setUser(null);
    // };
    // signInAsync = async () => {
    //     try {
    //       await GoogleSignIn.askForPlayServicesAsync();
    //       const { type, user } = await GoogleSignIn.signInAsync();
    //       if (type === 'success') {
    //         _syncUserWithStateAsync();
    //       }
    //     } catch ({ message }) {
    //       alert('login: Error:' + message);
    //     }
    // };
    const [loading,setLoading]=useState(false);
    const [request, response, promptAsync,user] = Google.useAuthRequest({
        expoClientId: envs.EXPO_CLIENT_ID,
        // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        androidClientId: envs.ANDROID_CLIENT_ID,
        // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    });
    const getUserInfo= async (token) =>{
        axios.get(` https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
        .then(res => {
            console.log(res.data);
            axios.post(`${envs.BACKEND_URL}/mobile/login`, {email:res.data.email,lname:res.data.family_name,fname:res.data.given_name,google_auth:true})
            .then(res => {
                if(res.data.success){
                    setLoading(false);
                    setAlert({visible:true,message:"You are logged in.",colorScheme:"success",header:"Success"});
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
                    resetForm();
                    axios.post(`${envs.BACKEND_URL}/mobile/verify_email`, {email:values.email})
                    .then(res=>{
                        if(res.data.success){
                            setAlert({visible:true,message:"You are logged in.",colorScheme:"success",header:"Success"});
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
        if (values.email !== '' && values.password !== '') {
            setLoading(true);
            axios.post(`${envs.BACKEND_URL}/mobile/login`, {email:values.email,password:values.password})
            .then(res => {
                if(res.data.success && res.data.verified){
                    setLoading(false);
                    setAlert({visible:true,message:"You are logged in.",colorScheme:"success",header:"Success"});
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
    }
    const { handleChange, handleSubmit, values } = useFormik({
        initialValues:{ email: '',password:'' },
        onSubmit: handleFormSubmit
    });
    const [alert,setAlert]=useState({
        visible:false,
        message:null,
        colorScheme:null,
        header:null
    });
    useEffect(() => {
        // initAsync();
        if (response?.type === 'success') {
            const { authentication} = response;
            getUserInfo(authentication.accessToken);
        }
    },[response]);
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
                        <Input size="md" width="300" placeholder="Email Address" 
                            onChangeText={handleChange('email')}
                            value={values.fname}
                        />
                        <Input size="md" type='password' width="300" placeholder="Password" isFullWidth={true}
                            onChangeText={handleChange('password')}
                            value={values.fname}
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
                        >Sign in</Button>
                    </Stack>
                </Center>
            </ScrollView>
            {loading?(<ActivityIndicator/>):(<></>)}
        </>
    )
}

export default SignInPage
