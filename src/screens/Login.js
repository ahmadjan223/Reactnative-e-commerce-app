import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

//main component here
export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible,setVisible] = useState(false)
  //checking login credentials
  const Clean =()=>{
    setEmail('')
    setPassword('')
  }
  const ONLoginPress = async()=>{
    try{
      setVisible(true)
      const res = await firestore().collection('user').where('email','==',email).where('password','==',password).get()
      setVisible(false)
      //on successful Login
      if (!res.empty){
        const userId = res.docs[0].id;
        const data = res.docs[0].data();
        //saving data to async
        await Promise.all([
          AsyncStorage.setItem('user_id', userId),
          AsyncStorage.setItem('name', data.name),
          AsyncStorage.setItem('email', data.email),
        ]);
        navigation.navigate('Main')     
      }else{
        Clean();
        Alert.alert('Either email or password is incorrect');
      }
    }catch(error){
      console.log('error is login',error)
    }
  }
  return (
    <View style={styles.main}>
      {
        visible && <Loader></Loader>
      }
      <Image
        source={require('../images/bannerLogin.jpg')}
        style={styles.banner}></Image>
      <View style={styles.card}>
        <Text style={styles.titleLogin}>Login</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor={'grey'}
          value={email}
          onChangeText={text => {
            setEmail(text);
          }}></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="password"
          placeholderTextColor={'grey'}
          value={password}
          onChangeText={text => {
            setPassword(text);
          }}></TextInput>
        <TouchableOpacity 
        style={styles.ButtonLogin}
        onPress={()=>{ONLoginPress()}}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity
          style={styles.ButtonSignup}
          onPress={() => {
            navigation.navigate('SignUp');
          }}>
          <Text style={[styles.buttonText, {color: 'green'}]}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  banner: {
    width: '100%',
    height: 250,
  },
  card: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    elevation: 5,
    borderTopEndRadius: 30,
    borderTopLeftRadius: 30,
    alignSelf: 'center',
  },
  titleLogin: {
    fontSize: 25,
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
  },
  orText: {
    color: 'black',
    textAlign: 'center',
    margin: 10,
  },
  textInput: {
    borderColor: 'grey',
    borderWidth: 1.2,
    color: 'grey',
    borderRadius: 15,
    width: '85%',
    height: 55,
    alignSelf: 'center',
    marginTop: 20,
    paddingLeft: 10,
  },
  ButtonLogin: {
    backgroundColor: 'green',
    width: '85%',
    height: 50,
    elevation: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  ButtonSignup: {
    backgroundColor: 'transparent',
    width: '85%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderColor: 'green',
    borderWidth: 1.2,
  },
});
