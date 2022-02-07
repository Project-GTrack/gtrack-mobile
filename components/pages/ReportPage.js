import React, { useEffect, useState } from 'react'
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
    Stack,
    HStack
  } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"
import axios from 'axios';
import { useFormik } from 'formik';
import envs from '../../config/env.js'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MessageAlert from '../helpers/MessageAlert';
import PickImage from '../helpers/PickImage.js';
import { uuidGenerator } from '../helpers/uuidGenerator.js';

const ReportPage = () => {
    const [initialValues, setInitialValues] = useState(null);
    const [user,setUser]=useState(null);
    const [path,setPath]=useState(null);
    const [images,setImages]=useState([]);
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
        setPath(`/gtrack-mobile/concern/${uuidGenerator()}`);
      }, []);
    useEffect(() => {
      if(user){
        setInitialValues({
          email:user.email?user.email:"",
          subject:"",
          message:"",
          classification:""
        })
      };
    }, [user]);
    const handleFormSubmit = async (values,{resetForm}) =>{
        axios.post(`${envs.BACKEND_URL}/mobile/concern/send`,{email:values.email,subject:values.subject,message:values.message,classification:values.classification,images:images})
        .then(res => {
            if(res.data.success){
                resetForm();
                setImages([]);
                setAlert({visible:true,message:res.data.message,colorScheme:"success",header:"Success"});
            }else{
                setAlert({visible:true,message:res.data.message,colorScheme:"danger",header:"Error"})
            }
        })
    }
    const { handleChange, handleSubmit, values } = useFormik({
        initialValues:initialValues,
        enableReinitialize:true,
        onSubmit: handleFormSubmit
    });
    return (
        <ScrollView>
        <MessageAlert alert={alert} setAlert={setAlert}/>
        <Center
            px={5}
            mt={10}
        >
            <Stack space={3} style={{alignSelf:'stretch'}}>
                <Input 
                    size="md" 
                    placeholder="Subject"
                    bg={'white'}
                    value={values&&values.subject?values.subject:""} onChangeText={handleChange('subject')}
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
                    value={values&&values.message?values.message:""} onChangeText={handleChange('message')}
                />
                <PickImage path={path} value={images} setValue={setImages} multiple={true}/>
                
                <Center >
                    <HStack>
                    {images.map((img,i)=>{
                        return  <Image key={i}
                                    size={50}
                                    resizeMode={"contain"}
                                    source={{uri: img}}
                                    alt="Concern Photo"
                                    rounded={'full'}
                                />
                        })
                    }
                    </HStack>
                </Center>
                <Select
                    accessibilityLabel="Choose report category"
                    placeholder="Choose report category"
                    _selectedItem={{
                        bg: "success.500",
                        endIcon: <CheckIcon size="5" />,
                    }}
                    selectedValue={values&&values.classification?values.classification:""}
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
                    onValueChange={handleChange('classification')}
                >
                    <Select.Item label="Violation" value="Violation" />
                    <Select.Item label="Delay" value="Delay" />
                    <Select.Item label="Pile-up" value="Pile-up" />
                </Select>
            </Stack>
            <Button colorScheme='danger' mt={10} mb={2}
                leftIcon={
                    <Icon
                        as={<MaterialIcons name="send" />}
                        color={'white'}
                        size={5}
                    />
                }
                onPress={handleSubmit}
            >Send Report</Button>
        </Center>
        </ScrollView>
    )
}
// const Upload = () => {
//     const pickImages = async () => {
//         // No permissions request is necessary for launching the image library
//         let result = await ImagePicker.launchImageLibraryAsync({
//           mediaTypes: ImagePicker.MediaTypeOptions.All,
//           allowsEditing: true,
//           aspect: [4, 3],
//           quality: 1,
//           allowsMultipleSelection: true,
//         });
        
//         if (!result.cancelled) {
//             console.log(result.selected[0].uri);
//             // uploadImagesAsync(result.selected);
//         }else{
//             console.log("cancelled")
//         }
//     };
  
//     return (
//         <Button mt={3} colorScheme="success" onPress={()=>pickImages()} 
//             leftIcon={ <Icon
//                 as={<MaterialIcons name="attachment" />}
//                 color={'white'}
//                 size={5}
//             />} 
//         >
//             Attach files/photos
//         </Button>
//     );
// };
export default ReportPage
