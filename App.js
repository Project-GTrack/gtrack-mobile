import React, { useEffect,useState } from "react";
import {
  NativeBaseProvider,
} from "native-base";
import envs from './config/env.js'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInPage from "./components/pages/SignInPage";
import SignUpPage from "./components/pages/SignUpPage";
import Toolbar from "./components/helpers/Toolbar";
import Drawer from "./components/helpers/Drawer";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage.js";

const Stack = createNativeStackNavigator();

export default function App() {
  console.log(envs);
  const getData = async () => {
      const value = await AsyncStorage.getItem('@user');
      if(value!==null){
        setUser(JSON.parse(value));
      }
  }
  const [user,setUser]= useState(null);
  useEffect(() => {
    getData();
  }, []);
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={user?"Drawer":"SignInPage"}
        >
          <Stack.Screen
            name="SignInPage"
            component={SignInPage}
            // options={{ title: 'Welcome' }}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUpPage"
            component={SignUpPage}
            // options={{ title: 'Welcome' }}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgotPasswordPage"
            component={ForgotPasswordPage}
            // options={{ title: 'Welcome' }}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Drawer"
            component={Drawer}
            options={{headerShown: false}}
          />  
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
