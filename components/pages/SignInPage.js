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
    HStack
  } from "native-base";
import GtrackMainLogo from '../../assets/gtrack-logo-1.png'
import GoogleIcon from '../../assets/google-icon.png'

const SignInPage = ({navigation}) => {
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
            <Stack space={3} alignItems="center">
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
                    onPress={() =>
                        navigation.navigate('Toolbar')
                    } 
                >Sign in</Button>
            </Stack>
        </Center>
        </>
    )
}

export default SignInPage
