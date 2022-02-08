import React, { useEffect, useState } from 'react'
import {
    Button,
    Icon,
  } from "native-base";
import { MaterialIcons } from "@expo/vector-icons"
import * as ImagePicker from 'expo-image-picker';
import { uuidGenerator } from './uuidGenerator.js';
import Firebase from '../helpers/Firebase';
import { LogBox } from 'react-native';
const storage=Firebase.storage();
const PickImage = ({multiple,path,value,setValue}) => {
    useEffect(() => {
        LogBox.ignoreLogs(['Setting a timer']);
    }, []);
    
    const uploadMultipleImageAsync=async(value,setValue,selected,path)=>{
        var imageTemp=[...value];
        // selected.map(async (item)=>{
            const response = await fetch(selected.uri);
            const blob = await response.blob();
            const filename=`${path}/${uuidGenerator()}`;
            const ref = storage.ref().child(filename);
            const snapshot = await ref.put(blob);
            const remoteUri = await snapshot.ref.getDownloadURL();
            imageTemp.push(remoteUri);
            blob.close();
        // })
        setValue([...imageTemp]);
    }
    const uploadSingleImageAsync=async(setValue,selected,path)=>{
        const newPath=`${path}/${uuidGenerator()}`
        const response = await fetch(selected.uri);
        const blob = await response.blob();
        const ref = storage.ref().child(newPath);
        const snapshot = await ref.put(blob);
        blob.close();
        const remoteUri = await snapshot.ref.getDownloadURL();
        setValue(remoteUri);
    }
    const handlePickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            aspect: [4, 3],
            quality: 1,
            allowsMultipleSelection: multiple,
        });
        if(!result.cancelled){
            if(multiple){
                await uploadMultipleImageAsync(value,setValue,result,path);
            }else{
                await uploadSingleImageAsync(setValue,result,path);
            }
        }
        
    };
    return (
        <Button mt={3} colorScheme="success" onPress={handlePickImage} 
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

export default PickImage;