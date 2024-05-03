import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';
//main component
const AddAdress = ({navigation}) => {
  const [city, setCity] = useState('');
  const [adress, setAdress] = useState('');
  const [postCode, setPostCode] = useState('');
  const [hint, setHint] = useState('');
  const [visible, setVisible] = useState(false);
  //saving adress to db
  const Clear =()=>{
    setAdress('')
    setCity('')
    setHint('')
    setPostCode('')
  }
  const SaveAdress = async () => {
    console.log('save adress is called')
    setVisible(true);
    try{
      const userId = await AsyncStorage.getItem('user_id');
      const id = uuid.v4();
      await firestore().collection('address').doc(id).set({
        id: id,
        adder_id: userId,
        default: false,
        city: city,
        address: adress,
        post_code: postCode,
        hint: hint,
      });
      console.log('adresss added successfully')
      Clear()
      setVisible(false);
      navigation.goBack()
    } catch(error){
      console.log('error in saving adress',error)
      setVisible(false)
    }
  };
  return (
    <View style={styles.mainView}>
      {visible && <Loader></Loader>}
      <TextInput
        style={styles.textinput}
        placeholder="city"
        placeholderTextColor={'grey'}
        onChangeText={val => {
          setCity(val);
        }}
        value={city}
      />
      <TextInput
        style={styles.textinput}
        placeholderTextColor={'grey'}
        placeholder="adress"
        onChangeText={val => {
          setAdress(val);
        }}
        value={adress}
      />
      <TextInput
        style={styles.textinput}
        placeholderTextColor={'grey'}
        placeholder="post code"
        onChangeText={val => {
          setPostCode(val);
        }}
        value={postCode}
      />
      <TextInput
        style={styles.textinput}
        placeholder="hint"
        placeholderTextColor={'grey'}
        onChangeText={val => {
          setHint(val);
        }}
        value={hint}
      />
      <TouchableOpacity style={styles.button}>
        <Text onPress={SaveAdress} style={styles.buttonText}>
          Save adress
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    color: 'transparent',
  },
  button: {
    width: '80%',
    height: 50,
    elevation: 5,
    borderRadius: 15,
    backgroundColor: 'green',
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  textinput: {
    width: '80%',
    height: 50,
    color: 'black',
    borderWidth: 0.5,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    paddingLeft: 10,
    fontSize: 15,
  },
});
export default AddAdress;
