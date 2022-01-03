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

const SignUpPage = ({navigation}) => {
    return (
        <>
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
                <HStack space={2}>
                    <Input size="md" width="148" placeholder="First Name" />
                    <Input size="md" width="148" placeholder="Last Name" />
                </HStack>
                <Input size="md" width="300" placeholder="Email Address" />
                <Input size="md" type='password' width="300" placeholder="Password" isFullWidth={true}/>
                <Input size="md" type='password' width="300" placeholder="Repeat Password" isFullWidth={true}/>
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
                <Button width="300" colorScheme="success" onPress={() => console.log("hello world")}>Sign Up</Button>
            </Stack>
        </Center>
        </>
    )
}

export default SignUpPage
