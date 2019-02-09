 import React, {Component} from 'react';
 import {Platform, StyleSheet, Text, View} from 'react-native';
 import { createStackNavigator, createAppContainer } from 'react-navigation';
 import {Provider} from 'react-redux';
 import LoginScreen from './src/screens/LoginScreen';
 import SignupScreen from './src/screens/SignupScreen';
 import HomeScreen from './src/screens/HomeScreen';
 import ChatScreen from './src/screens/ChatScreen';
 import NewMessageScreen from './src/screens/NewMessageScreen';
 import configureStore from './store/configure-store';

 const AppNavigator = createStackNavigator({
   LoginScreen:LoginScreen,
   SignupScreen:SignupScreen,
   HomeScreen:HomeScreen,
   ChatScreen: ChatScreen,
   NewMessageScreen: NewMessageScreen
 },
 {
   headerMode: 'none',
   navigationOptions: {
     headerVisible: false
   }
 });

 const AppContainer = createAppContainer(AppNavigator);
 const store = configureStore();

 export default class App extends Component {
   render() {
     return (
       <Provider store={store}>
         <View style={styles.container}>
           <AppContainer />
         </View>
        </Provider>
     );
   }
 }

 const styles = StyleSheet.create({
   container: {
     flex: 1,
   },
 });
