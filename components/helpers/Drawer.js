import React, { useState,useEffect } from 'react'
import CustomDrawerContent from "./CustomDrawerContent";
import Toolbar from './Toolbar';
import { createDrawerNavigator,useDrawerStatus} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DrawerPage = createDrawerNavigator();
const Drawer = ({navigation}) => {
    const [user,setUser]=useState(null);
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
    }, []);
    return (
        <DrawerPage.Navigator
            screenOptions={{
                drawerPosition:'right'
            }}
            drawerContent={(props) => <CustomDrawerContent getData={getData} user={user} {...props}/>}
        >
            <DrawerPage.Screen name="Toolbar" component={Toolbar} options={{headerShown: false}}/>
        </DrawerPage.Navigator>
    )
}

export default Drawer;
