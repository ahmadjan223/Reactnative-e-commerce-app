import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import Main from '../screens/Main';
import Home from '../screens/bottomTabs/Home';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Checkout from '../screens/Checkout';
import Adress from '../screens/Adress';
import AddAdress from '../screens/AddAdress';
import Orders from '../screens/Orders';
const Stack = createStackNavigator();
const StackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{headerShown: true}}></Stack.Screen>
        <Stack.Screen
          name="Adress"
          component={Adress}
          options={{headerShown: true}}></Stack.Screen>
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{headerShown: true}}></Stack.Screen>
        <Stack.Screen
          name="AddAdress"
          component={AddAdress}
          options={{headerShown: true}}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigation;
