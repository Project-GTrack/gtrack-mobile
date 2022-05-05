import React from 'react';
import { AlertDialog, Button, Center, Divider, HStack, Icon, Image, Link, Text } from "native-base";
import * as WebBrowser from "expo-web-browser";
import GoogleIcon from '../../assets/google-icon.png'
import { MaterialIcons } from "@expo/vector-icons";


const GooglePermissionAlert = ({open,setOpen,signInAsync,setLoading}) => {
    const privacyPolicy = async () => {
        let res = await WebBrowser.openBrowserAsync('https://www.gtrack.life/privacy_policy');
    };
    const handleClose=()=>{
        setOpen(false);
        setLoading(false)
    }
    const handleAllow=()=>{
        setOpen(false);
        signInAsync();
    }
  return (
    <AlertDialog isOpen={open} onClose={handleClose}>
        <AlertDialog.Content>
            <AlertDialog.CloseButton />
            <AlertDialog.Header>
                <HStack>
                    <Image
                        size={5}
                        resizeMode={"contain"}
                        source={GoogleIcon}
                        alt="Google Icon"
                        marginRight={2}
                    />
                    <Text>Sign in with Google</Text>
                </HStack>
            </AlertDialog.Header>
            <AlertDialog.Body>
                <Center>
                    <Text textAlign={"center"} fontSize={"xl"}>To continue, Google will share your:</Text>
                </Center>
                <Divider my={5} />
                <HStack marginLeft={2}>
                    <Icon
                        as={<MaterialIcons name="account-circle" />}
                        size={25}
                        color={"#3474e0"}
                        marginRight={3}
                    />
                    <Text>Basic profile info</Text>
                </HStack>
                <Divider my={5} />
                <HStack marginLeft={2}>
                    <Icon
                        as={<MaterialIcons name="account-circle" />}
                        size={25}
                        color={"#3474e0"}
                        marginRight={3}
                    />
                    <Text>Email address</Text>
                </HStack>
                <Divider my={5} />
                    By clicking Allow, you allow this app and Google to use your information
                    in accordance with their respective <Link onPress={()=>privacyPolicy()}>privacy policy.</Link>
                
            </AlertDialog.Body>
            <AlertDialog.Footer>
                <Button.Group space={2}>
                  <Button colorScheme={"dark"} onPress={handleClose}>
                    Deny
                  </Button>
                  <Button style={{backgroundColor:"#3474e0"}} onPress={handleAllow}>
                    Allow
                  </Button>
                </Button.Group>
            </AlertDialog.Footer>
        </AlertDialog.Content>
    </AlertDialog>
  );
};

export default GooglePermissionAlert;