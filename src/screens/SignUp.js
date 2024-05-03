import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Loader from './Loader';

export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);
  //saving to firestore
  const SignUpUser = async () => {
    try {
      setVisible(true);
      const id = uuid.v4();
      await firestore().collection('user').doc(id).set({
        name: name,
        email: email,
        contact: contact,
        password: password,
        id:id,
      });
      console.log('user created successfully');
      setVisible(false);
      navigation.goBack();
    } catch (error) {
      console.log('error in registering user', error);
    }
  };
  return (
    <View style={styles.main}>
      {visible && <Loader />}
      <Image
        source={require('../images/bannerLogin.jpg')}
        style={styles.banner}></Image>
      <View style={styles.card}>
        <Text style={styles.titleLogin}>Login</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Name"
          placeholderTextColor={'grey'}
          value={name}
          onChangeText={text => {
            setName(text);
          }}></TextInput>
        <TextInput
          style={styles.textInput}
          placeholder="Contact No"
          placeholderTextColor={'grey'}
          value={contact}
          onChangeText={text => {
            setContact(text);
          }}></TextInput>
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
        <TextInput
          style={styles.textInput}
          placeholder="Confirm password"
          placeholderTextColor={'grey'}
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
          }}></TextInput>
        <TouchableOpacity
          style={styles.ButtonSignup}
          onPress={() => {
            SignUpUser();
          }}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>OR</Text>
        <TouchableOpacity
          style={styles.ButtonLogin}
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <Text style={[styles.buttonText, {color: 'green'}]}>Login</Text>
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
  ButtonSignup: {
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
  ButtonLogin: {
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
