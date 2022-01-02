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
    Stack
  } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"
import GtrackMainLogo from '../../assets/gtrack-logo-1.png'
import GoogleIcon from '../../assets/google-icon.png'

const HomePage = () => {
    return (
        <>
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
            <Stack space={4} alignItems="center">
                <Link onPress={() => console.log("hello world")} >
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
                <Input size="md" width="300" placeholder="Email Address" />
                <Input size="md" type='password' width="300" placeholder="Password" isFullWidth={true}/>
                <Button width="300" colorScheme="success" onPress={() => console.log("hello world")}>Sign in</Button>
            </Stack>
        </Center>
        </>
    )
}

export default HomePage
