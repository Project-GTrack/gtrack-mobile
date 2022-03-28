import React, { useEffect } from 'react'
import {ImageBrowser} from 'expo-image-picker-multiple';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import Firebase from './Firebase';
import { uuidGenerator } from './uuidGenerator';
import { MaterialIcons } from "@expo/vector-icons";

const storage=Firebase.storage();
const ImageBrowserScreen = ({navigation,route}) => {
    const {path,fromPage}=route.params;
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => _getHeaderLeftClose()
        });
    }, [])
    
    const _getHeaderLoader = () => (
        <ActivityIndicator size='small' style={{padding:15}} color={'#0580FF'}/>
    );
    const _getHeaderLeftClose = () => {
        return <TouchableOpacity  title={'Done'} onPress={()=>navigation.navigate(fromPage, {photos: []})}>
          <Text style={{padding:15}}><MaterialIcons size={20} name="close" /></Text>
        </TouchableOpacity>
    };
    const imagesCallback = (callback) => {
        navigation.setOptions({
          headerRight: () => _getHeaderLoader()
        });
        callback.then(async (photos) => {
          const cPhotos = [];
          for(let photo of photos) {
            const response = await fetch(photo.uri);
            const blob = await response.blob();
            const filename=`${path}/${uuidGenerator()}`;
            const ref = storage.ref().child(filename);
            const snapshot = await ref.put(blob);
            const remoteUri = await snapshot.ref.getDownloadURL();
            cPhotos.push(remoteUri);
          }
          navigation.navigate(fromPage, {photos: cPhotos});
        })
        .catch((e) => console.log(e));
    };
    const _renderDoneButton = (count, onSubmit) => {
        if (!count) return null;
        return <TouchableOpacity  title={'Done'} onPress={onSubmit}>
          <Text style={{padding:15}} onPress={onSubmit}>Done</Text>
        </TouchableOpacity>
    }
    const updateHandler = (count, onSubmit) => {
        navigation.setOptions({
          title: `Selected ${count} files`,
          headerRight: () => _renderDoneButton(count, onSubmit)
        });
    };
    const renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );
    const emptyStayComponent = <Text style={styles.emptyStay}>Empty ...</Text>;
    
    return (
        <View style={[styles.flex, styles.container]}>
            <ImageBrowser
                max={3}
                onChange={updateHandler}
                callback={imagesCallback}
                renderSelectedComponent={renderSelectedComponent}
                emptyStayComponent={emptyStayComponent}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    flex: {
      flex: 1
    },
    container: {
      position: 'relative'
    },
    emptyStay:{
      textAlign: 'center',
    },
    countBadge: {
      paddingHorizontal: 8.6,
      paddingVertical: 5,
      borderRadius: 50,
      position: 'absolute',
      right: 3,
      bottom: 3,
      justifyContent: 'center',
      backgroundColor: '#0580FF'
    },
    countBadgeText: {
      fontWeight: 'bold',
      alignSelf: 'center',
      padding: 'auto',
      color: '#ffffff'
    }
  });
export default ImageBrowserScreen