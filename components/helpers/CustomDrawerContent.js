import React from 'react'
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
    Icon,
    VStack
  } from "native-base";
import UserAvatar from '../../assets/user-avatar.png'
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomDrawerContent = ({navigation}) => {
    const removeData = async () => {
        try {
            const value = await AsyncStorage.getItem('@user');
            if(value){
                await AsyncStorage.removeItem('@user');
                navigation.replace('SignInPage');
            }
        } catch(e) {
            console.log(e);
        }
    }
    return (
        <Stack space={3} py={12} px={3}>
            <Center>
                <Box
                    size={"130"}
                    bg="gray.200"
                    rounded="full"
                >
                    <Center
                        my={'auto'}
                    >
                        <Image
                            size={120}
                            resizeMode={"contain"}
                            source={UserAvatar}
                            alt="User Avatar"
                            rounded={'full'}

                        />
                    </Center>
                </Box>
                <Text mt={3}>RESIDENT</Text>
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
                <Text fontSize={16}>John Snow</Text>
            </HStack>
            <HStack space={3}>
                <Icon
                    as={<MaterialIcons name="house" />}
                    color={"#10b981"}
                    size={28}
                    mx={3}
                />
                <Text fontSize={16} w={"50%"}>Purok Dalubis, Los Martires St., Poblacion</Text>
            </HStack>
            <HStack space={3}>
                <Icon
                    as={<MaterialIcons name="phone" />}
                    color={"#10b981"}
                    size={28}
                    mx={3}
                />
                <Text fontSize={16}>09123456789</Text>
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
