import React,{useState,useContext,useCallback} from 'react'
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
    HStack,
    VStack
  } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"
import GtrackMainLogo from '../../assets/gtrack-logo-1.png'
import UserAvatar from '../../assets/user-avatar.png'
import * as ImagePicker from 'expo-image-picker';
import GeneralInformationModal from '../modals/GeneralInformationModal';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import ChangeAddressModal from '../modals/ChangeAddressModal';

const ProfilePage = () => {
    const [showGIModal,setShowGIModal]=useState(false);
    const [showCPModal,setShowCPModal]=useState(false);
    const [showCAModal,setShowCAModal]=useState(false);
    return (
        <Center
            px={3}
            mt={10}
        >
            <Box
                size={"150"}
                bg="gray.200"
                rounded="full"
            >
                <Center
                    my={'auto'}
                >
                    <Image
                        size={130}
                        resizeMode={"contain"}
                        source={UserAvatar}
                        alt="User Avatar"
                        rounded={'full'}

                    />
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
                    onPress={()=>setShowCPModal(true)}
                >
                    Change Password
                </Button>
                <GeneralInformationModal showModal={showGIModal} setShowModal={setShowGIModal}/>
                <ChangePasswordModal showModal={showCPModal} setShowModal={setShowCPModal}/>
                <ChangeAddressModal showModal={showCAModal} setShowModal={setShowCAModal}/>
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
