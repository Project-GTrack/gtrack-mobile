import React from 'react'
import {
    Text,
    Image,
    Button,
    Center,
    Input,
    ScrollView,
    Select,
    Icon,
    CheckIcon,
    TextArea,
    Stack
  } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker';
import { fontSize, padding } from 'styled-system';


const ReportPage = () => {
    return (
        <ScrollView>
        <Center
            px={5}
            mt={10}
        >
            <Stack space={3} style={{alignSelf:'stretch'}}>
                <Input 
                    size="md" 
                    placeholder="Subject"
                    bg={'white'}
                />
                <TextArea
                    h={200}
                    bgColor={'white'}
                    placeholder="Write description here ..."
                    style={{
                      textAlignVertical:'top',
                      fontSize:14,
                    }}
                    p={3}
                />
                <Upload/>
                <Select
                    accessibilityLabel="Choose report category"
                    placeholder="Choose report category"
                    _selectedItem={{
                        bg: "success.500",
                        endIcon: <CheckIcon size="5" />,
                    }}
                    dropdownIcon={
                        <Icon
                        as={<MaterialIcons name="unfold-more" />}
                        color={'#10b981'}
                        size={7}
                        />
                    }
                    style={{
                        borderWidth: 1,
                        borderColor: '#10b981'
                    }}
                    onValueChange={(itemValue) => console.log(itemValue)}
                >
                    <Select.Item label="Violation" value="Violation" />
                    <Select.Item label="Delay" value="Delay" />
                </Select>
            </Stack>
            <Button bgColor={'#f43f5e'} mt={10} mb={2}
                leftIcon={
                    <Icon
                        as={<MaterialIcons name="send" />}
                        color={'white'}
                        size={5}
                    />
                }
            >Send Report</Button>
        </Center>
        </ScrollView>
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
        <Button mt={3} colorScheme="success" onPress={pickImage} 
            leftIcon={ <Icon
                as={<MaterialIcons name="attachment" />}
                color={'white'}
                size={5}
            />} 
        >
            Attach files/photos
        </Button>
    );
};
export default ReportPage
