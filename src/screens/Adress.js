import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FlatList} from 'react-native-gesture-handler';
const Adress = ({navigation}) => {
  const [adressList, setAdressList] = useState('');
  const [isFocused, setIsFocusted] = useState([]);
  const GetAdress = async userId => {
    try {
      const snapshot = await firestore()
        .collection('address')
        .where('adder_id', '==', userId)
        .get();
      setAdressList(snapshot.docs);
    } catch (error) {
      console.log('error in fetching adress data');
    }
  };
  useEffect(() => {
    const SnapFunction = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      const unsubscribe = firestore()
        .collection('address')
        .where('adder_id', '==', userId)
        .onSnapshot(() => {
          GetAdress(userId);
        });

      return () => {
        // Unsubscribe when the component unmounts
        unsubscribe();
      };
    };

    SnapFunction();
  }, []);
  const SetDefault = async item => {
    try {
      const temp = adressList;
      temp.map(async doc => {
        if (doc._data.id == item.id && !item.default) {
          await firestore().collection('address').doc(item.id).update({
            default: true,
          });
        }
        if (doc._data.default && doc._data.id != item.id) {
          await firestore().collection('address').doc(doc._data.id).update({
            default: false,
          });
        }
      });
    } catch (error) {
      console.log('error in selecting default', error);
    }
  };
  const RenderItem = ({item, index}) => {
    const data = item['_data'];
    console.log('checking value of adress set default:', data.default);
    return (
      <TouchableOpacity
        onPress={() => {
          SetDefault(data);
        }}
        style={styles.adressItem}>
        <View style={styles.textPart}>
          <Text style={styles.text}>city: {data.city}</Text>
          <Text style={styles.text}>address: {data.address}</Text>
          <Text style={styles.text}>post code: {data.post_code}</Text>
          <Text style={styles.text}>hint: {data.hint}</Text>
        </View>
        <View style={styles.buttonPart}>
          {data.default && <Text style={styles.buttonDefault}>default</Text>}
          <Text style={styles.buttonDelete}>edit</Text>
          <Text style={styles.buttonDelete}>delete</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.mainView}>
      <View>
        <FlatList data={adressList} renderItem={RenderItem}></FlatList>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text
          onPress={() => {
            navigation.navigate('AddAdress');
          }}
          style={styles.buttonText}>
          add new adress
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
    position: 'absolute',
    bottom: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  adressItem: {
    width: '90%',
    alignSelf: 'center',
    height: 100,
    flexDirection: 'row',
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 10,
    elevation: 4,
    justifyContent: 'space-between',
  },
  textPart: {
    paddingLeft: 20,
    justifyContent: 'center',
  },
  buttonPart: {
    // flex:1,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 14,
    color: 'black',
  },
  buttonDefault: {
    backgroundColor: 'green',
    color: 'white',
    fontSize: 12,
    borderRadius: 4,
    padding: 5,
  },
  buttonDelete: {
    color: 'green',
    fontSize: 12,
    padding: 4,
    borderWidth: 0.5,
    borderRadius: 7,
    borderColor: 'green',
  },
});

export default Adress;
