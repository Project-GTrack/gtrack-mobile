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
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth = Firebase.auth();
const SignUpPage = ({navigation}) => {
    const [loading,setLoading]=useState(false);
    const [request, response, promptAsync,user] = Google.useAuthRequest({
        expoClientId: envs.EXPO_CLIENT_ID,
        // iosClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
        androidClientId: envs.ANDROID_CLIENT_ID,
        // webClientId: 'GOOGLE_GUID.apps.googleusercontent.com',
    });
    const setData = async (data) => {
        try {
            const jsonValue = JSON.stringify(data);
            await AsyncStorage.setItem('@user', jsonValue);
            navigation.replace('Drawer');
        } catch (e) {
            setAlert({visible:true,message:e,colorScheme:"danger",header:"Error"});
        }
    }
    const getUserInfo= async (token) =>{
        axios.get(` https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`)
        .then(res => {
            axios.post(`${envs.BACKEND_URL}/mobile/register`, {email:res.data.email,lname:res.data.family_name,fname:res.data.given_name,image:res.data.picture,google_auth:true})
            .then(res => {
                if(res.data.success){
                    setLoading(false);
                    setData(res.data.data);
                    // setAlert({visible:true,message:"You are logged in.",colorScheme:"success",header:"Success"});
                }else{
                    setLoading(false);
                    setAlert({visible:true,message:"Account already existed.",colorScheme:"danger",header:"Error"});
                }
            })
        })
    }
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
            if (values.password === values.passwordRepeat) {
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
            }else{
                setAlert({visible:true,message:"Password did not match.",colorScheme:"danger",header:`Password Mismatch`});
            }
    }
    const { handleChange, handleSubmit, values } = useFormik({
        initialValues:{ email: '',fname:'',lname:'',password:'',passwordRepeat:'',user_type:'Resident' },
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
                    <HStack space={2}>
                        <Input isRequired size="md" width="148" placeholder="First Name" 
                            onChangeText={handleChange('fname')}
                            value={values.fname}
                        />
                        <Input isRequired size="md" width="148" placeholder="Last Name" 
                            onChangeText={handleChange('lname')}
                            value={values.lname}
                        />
                    </HStack>
                    <Input size="md" isRequired width="300" placeholder="Email Address" 
                        onChangeText={handleChange('email')}
                        value={values.email}
                    />
                    <Input size="md" isRequired type='password' width="300" placeholder="Password" isFullWidth={true}
                        onChangeText={handleChange('password')}
                        value={values.password}
                    />
                    <Input size="md" isRequired type='password' width="300" placeholder="Repeat Password" isFullWidth={true}
                        onChangeText={handleChange('passwordRepeat')}
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
                    <Button width="300" colorScheme="success" onPress={handleSubmit}>Sign Up</Button>
            </Stack>
        </Center>
        </ScrollView>
        {loading?(<ActivityIndicator/>):(<></>)}
        </>
    )
}

export default SignUpPage
