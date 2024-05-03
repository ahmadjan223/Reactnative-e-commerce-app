import {View, StyleSheet, Image, Text, TouchableOpacity, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSafeAreaFrame} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const User = () => {
  const navigation = useNavigation()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  useEffect(() => {
    const FetchData = async () => {
      const name = await AsyncStorage.getItem('name');
      const email = await AsyncStorage.getItem('email');
      setName(name);
      setEmail(email);
    };
    FetchData();
  }, []);
  return (
    <View style={styles.main}>
      <Image
        source={require('../images/user.png')}
        style={styles.image}></Image>
      <Text style={styles.text}>{name}</Text>
      <Text style={[styles.text,{color:'grey'}]}>{email}</Text>
      <FlatList
      data={["Order","Address","Notifications","Terms & conditions","About Us","Contact us","log out"]}
      renderItem={({item,index})=>{
        return <TouchableOpacity 
        onPress={()=>{
          if(index == 0){
            navigation.navigate('Orders');
          }
        }}
        style = {styles.listItem}>
            <Text style={styles.listText}>{item}</Text>
          </TouchableOpacity>
      }}
      >
      </FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 50,
  },
  text: {
    color: 'black',
    fontSize:16,
    fontWeight:'600',
  },
  listItem:{
    width:Dimensions.get('window').width-40,
    height:60,
    borderBottomWidth:0.4,
    borderBottomColor:'grey',
    justifyContent:'center',
  },
  listText:{
    // paddingLeft:10,
    fontSize:20,
    color:'grey',
  }
});
export default User;
