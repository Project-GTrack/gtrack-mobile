import React from 'react'
import CustomDrawerContent from "./CustomDrawerContent";
import Toolbar from './Toolbar';
import { createDrawerNavigator } from '@react-navigation/drawer';

const DrawerPage = createDrawerNavigator();

const Drawer = () => {
    return (
        <DrawerPage.Navigator
            screenOptions={{
                drawerPosition:'right'
            }}
            drawerContent={(props) => <CustomDrawerContent {...props}/>}
        >
            <DrawerPage.Screen name="Toolbar" component={Toolbar} options={{headerShown: false}}/>
        </DrawerPage.Navigator>
    )
}

export default Drawer;
