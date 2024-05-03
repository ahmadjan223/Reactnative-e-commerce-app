import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const getOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      const snapshot = await firestore()
        .collection('order')
        .where('item.adder_id', '==', userId)
        .get();
      temp = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      setOrders(temp);
    } catch (error) {
      console.log('error in getting order data', error);
    }
  };
  getOrders();
  const RenderItem = ({item}) => {
    const data = item.item.item;
    return (
      <View style={styles.ItemMain}>
        <View style={styles.productItem}>
          <Image
            style={styles.productImage}
            source={{
              uri: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?cs=srgb&dl=pexels-math-90946.jpg&fm=jpg',
            }}
          />
          <View>
            <Text style={styles.productName}>{data.name}</Text>
            <Text style={styles.productDescription}>{data.description}</Text>
          </View>
        </View>
        <View style={styles.statusView}></View>
            <Text style={styles.status}>{item.status}</Text>
      </View>
    );
  };
  return (
    <View style={styles.main}>
      <FlatList data={orders} renderItem={RenderItem}></FlatList>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  productItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  ItemMain: {
    height: 100,
    width: Dimensions.get('window').width - 20,
    elevation: 5,
    marginTop: 10,
    borderRadius: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    margin: 10,
  },
  productName: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
  },
  productDescription: {
    color: 'black',
    fontSize: 15,
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignItems: 'center',
  },
  status: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
  },
  statusView: {
    height: '100%',
    width: 80,
    backgroundColor: 'transparent',
  },
  buttonStyle: {
    with: 80,
    height: 50,
    justifyContent: 'center',
    // backgroundColor:'green',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
export default Orders;
