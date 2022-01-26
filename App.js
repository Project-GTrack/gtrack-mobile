import React from "react";
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
import { initializeApp } from 'firebase/app';



const firebaseConfig = {
  apiKey: "AIzaSyBgm4wnKRFsVZBNvj4kntTzNB-gBw4nnSc",
  authDomain: "mapsample-51a36.firebaseapp.com",
  databaseURL: "https://mapsample-51a36.firebaseio.com",
  projectId: "mapsample-51a36",
  storageBucket: "mapsample-51a36.appspot.com",
  messagingSenderId: "42946705440",
  appId: "1:42946705440:web:1b76b0abc758b9f2f9a445",
  measurementId: "G-YNRQ8ZCTXD"
};

initializeApp(firebaseConfig);

// Define the config
// const config = {
//   useSystemColorMode: false,
//   initialColorMode: "dark",
// };
const Stack = createNativeStackNavigator();
// extend the theme
// export const theme = extendTheme({ config });

export default function App() {
  console.log(envs);
  return (
    <NativeBaseProvider>
      {/* <Center
        _dark={{ bg: "blueGray.900" }}
        _light={{ bg: "blueGray.50" }}
        px={4}
        flex={1}
      >
        <VStack space={5} alignItems="center">
          <NativeBaseIcon />
          <Heading size="lg">Welcome to NativeBase</Heading>
          <HStack space={2} alignItems="center">
            <Text>Edit</Text>
            <Code>App.js</Code>
            <Text>and save to reload.</Text>
          </HStack>
          <Link href="https://docs.nativebase.io" isExternal>
            <Text color="primary.500" underline fontSize={"xl"}>
              Learn NativeBase
            </Text>
          </Link>
          <ToggleDarkMode />
        </VStack>
      </Center> */}
      <NavigationContainer>
        <Stack.Navigator>
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
            name="Drawer"
            component={Drawer}
            options={{headerShown: false}}
          />  
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

// Color Switch Component
// function ToggleDarkMode() {
//   const { colorMode, toggleColorMode } = useColorMode();
//   return (
//     <HStack space={2} alignItems="center">
//       <Text>Dark</Text>
//       <Switch
//         isChecked={colorMode === "light" ? true : false}
//         onToggle={toggleColorMode}
//         aria-label={
//           colorMode === "light" ? "switch to dark mode" : "switch to light mode"
//         }
//       />
//       <Text>Light</Text>
//     </HStack>
//   );
// }
