import React, { useEffect } from 'react'
import {
    Text,
    Image,
    Button,
    Center,
    Divider,
    Box,
    Stack,
    HStack,
    Icon,
    VStack,
  } from "native-base";
import { useDrawerStatus} from '@react-navigation/drawer';
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Firebase from '../helpers/Firebase.js';
import * as Google from 'expo-google-app-auth';
import envs from '../../config/env.js'

const database=Firebase.database();
const auth=Firebase.auth();
const CustomDrawerContent = ({navigation,user,getData}) => {
    const removeUserData=async()=>{
        try {
            const value = await AsyncStorage.getItem('@user');
            if(value){
                await AsyncStorage.removeItem('@user');
                navigation.replace('SignInPage');
            }
        }
        catch(e) {
            console.log(e);
        }
    }
    const removeGoogleData=async()=>{
        try {
            const accessToken = await AsyncStorage.getItem('@accessToken');
            if(accessToken){
                await Google.logOutAsync({ 
                    accessToken:accessToken,
                    clientId:  envs.EXPO_ANDROID_CLIENT_ID,
                    androidStandaloneAppClientId:  envs.ANDROID_CLIENT_ID,
                });
            }
        }
        catch(e) {
            console.log(e);
        }
    }
    const removeAccessToken=async()=>{
        try {
            const accessToken = await AsyncStorage.getItem('@accessToken');
            if(accessToken){
                await AsyncStorage.removeItem('@accessToken');
            }
        }
        catch(e) {
            console.log(e);
        }
    }
    const removeData = async () => {
            if(auth.currentUser){
                await auth.signOut();
            }
            removeGoogleData();
            removeAccessToken();
            await database.ref(`/PushTokens/${user.user_id}`).remove();
            removeUserData();
    }
    const drawerStatus=()=>{
        return useDrawerStatus()==='open'?true:false;
    }
    const isOpen= drawerStatus();
    useEffect(() => {
      getData()
    }, [isOpen]);
    
    return (
        <Stack space={3} py={12} px={3}>
            <Center>
                <Box
                    size={"120"} //130 if with photo
                    bg="gray.400" //gray.200 if with photo
                    rounded="full"
                >
                    <Center
                        my={'auto'}
                    >
                        {user&&user.image?(
                            <Image
                                size="full"
                                key={user.image}
                                resizeMode={"cover"}
                                source={{uri:user.image}}
                                alt="User Avatar"
                                rounded={'full'}
                            />
                        ):(
                            <Text color={"white"} style={{fontWeight:"600"}} fontSize="5xl">{user?user.fname[0]+user.lname[0]:""}</Text>
                        )}
                        
                    </Center>
                </Box>
                <Text mt={4} style={{textTransform: 'uppercase'}}>{user?user.user_type:""}</Text>
            </Center>
            <Divider style={{
                alignSelf:'stretch',
            }} 
            bgColor={"#10b981"}
            />
            <VStack space={3} mx={3}>
            <HStack space={3} mt={3}>
                <Icon
                    as={<MaterialIcons name="person" />}
                    color={"#10b981"}
                    size={28}
                    mx={3}
                />
                <Text fontSize={16}>{user?user.fname:""} {user?user.lname:""}</Text>
            </HStack>
            <HStack space={3}>
                <Icon
                    as={<MaterialIcons name="info" />}
                    color={"#10b981"}
                    size={28}
                    mx={3}
                />
                <Text fontSize={16}>{user&&user.gender?user.gender:"Not set"} | {user&&user.birthday?moment().diff(user.birthday, 'years'):"Not set"}</Text>
            </HStack>
            <HStack space={3}>
                <Icon
                    as={<MaterialIcons name="house" />}
                    color={"#10b981"}
                    size={28}
                    mx={3}
                />
                <Text fontSize={16} w={"50%"}>{user&&(user.purok||user.street||user.barangay)?((user.purok?`${user.purok}, `:"") + (user.street?`${user.street}, `:"") + (user.barangay?`${user.barangay}`:"")):("Not set")}</Text>
            </HStack>
            <HStack space={3}>
                <Icon
                    as={<MaterialIcons name="phone" />}
                    color={"#10b981"}
                    size={28}
                    mx={3}
                />
                <Text fontSize={16}>{user&&user.contact_no?user.contact_no:"Not set"}</Text>
            </HStack>
            <HStack space={3}>
                <Icon
                    as={<MaterialIcons name="email" />}
                    color={"#10b981"}
                    size={28}
                    mx={3}
                />
                <Text fontSize={16} w={"80%"}>{user&&user.email?user.email:"Not set"}</Text>
            </HStack>
            </VStack>
            <Center>
                <Button 
                leftIcon={
                    <Icon
                        as={<MaterialIcons name="logout" />}
                        color={'white'}
                        size={5}
                    />
                }
                onPress={()=>removeData()} 
                mt={10} w={'1/2'} rounded={'full'} colorScheme='danger'>Logout</Button>
            </Center>
            
        </Stack>
    )
}

export default CustomDrawerContent
