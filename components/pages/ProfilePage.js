import React,{useState,useEffect} from 'react'
import {
    Text,
    Image,
    Button,
    Center,
    Box,
    VStack
  } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import GeneralInformationModal from '../modals/GeneralInformationModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import MessageAlert from '../helpers/MessageAlert';
import ChangeAddressModal from '../modals/ChangeAddressModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfilePage = () => {
    const [showGIModal,setShowGIModal]=useState(false);
    const [showCPModal,setShowCPModal]=useState(false);
    const [showCAModal,setShowCAModal]=useState(false);
    const [user,setUser]=useState(null);
    const [image,setImage]=useState(null);
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
    useEffect(() => {
      getData();
    }, []);
    return (
        <Center
            px={3}
            mt={10}
        >
            <MessageAlert alert={alert} setAlert={setAlert}/>
            <Box
                size={"150"}
                bg="gray.400"
                rounded="full"
            >
                <Center
                    my={'auto'}
                >
                    {user&&user.image?(
                        <Image
                            size={130}
                            resizeMode={"contain"}
                            source={{uri: user.image}}
                            alt="User Avatar"
                            rounded={'full'}
                        />
                    ):(
                        <Text color={"white"} style={{fontWeight:"600"}} fontSize="5xl">{user?user.fname[0]+user.lname[0]:""}</Text>
                    )}
                    
                </Center>
            </Box>
            
            {/* <Text
                mb={5}
                fontSize={"xl"}
                color={"gray.600"}
            >
                Profile
            </Text> */}
            <Upload/>
            <VStack 
                space={3} 
                mt={8}
                mx={3} 
                style={{
                    alignSelf:'stretch'
                }}
            >
                <Button
                    colorScheme='success'
                    onPress={()=>setShowGIModal(true)}
                >
                    General Information
                </Button>
                <Button
                    colorScheme='success'
                    onPress={()=>setShowCAModal(true)}
                >
                    Change Address
                </Button>
                <Button
                    colorScheme='success'
                    isDisabled={user&&user.google_auth?true:false}
                    onPress={()=>setShowCPModal(true)}
                >
                    Change Password
                </Button>
                <GeneralInformationModal alert={alert} setAlert={setAlert} user={user} showModal={showGIModal} setShowModal={setShowGIModal}/>
                <ChangePasswordModal alert={alert} setAlert={setAlert} user={user} showModal={showCPModal} setShowModal={setShowCPModal}/>
                <ChangeAddressModal alert={alert} setAlert={setAlert} user={user} showModal={showCAModal} setShowModal={setShowCAModal}/>
            </VStack>
        </Center>
    )
}
const Upload = () => {
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.cancelled) {
          console.log("Cancelled")
        }
    };
  
    return (
        <Button mt={3} colorScheme="success" onPress={pickImage}>Choose File</Button>
    );
  };

export default ProfilePage
