import React from 'react';
import {
    Spinner
} from "native-base";
import { View} from 'react-native'
const ActivityIndicator = () => {
  return (
    <View style={{
        position: 'absolute',
        width:'100%',
        height:'100%',
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    }}>
        <Spinner color="emerald.500" size="lg"/>
    </View>
  );
};

export default ActivityIndicator;
