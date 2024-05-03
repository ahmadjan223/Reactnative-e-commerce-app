import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  Button,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialogLogin from './DialogLogin';
import uuid from 'react-native-uuid';
import {useNavigation} from '@react-navigation/native';
import Loader from '../Loader';
// main component
const Home = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('cart')
      .onSnapshot(() => {});
    firestore();
  });
  //call for db to load products
  const FetchData = async () => {
    const snapshot = await firestore().collection('product').get(); // Use collection instead of user
    const productsData = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    }));
    setProducts(productsData);
  };
  //first time call only
  const AddToCart = async (item, userId) => {
    try {
      setLoader(true)
      //checking if item elready exist or not
      const res = await firestore()
      .collection('cart')
      .where('adder_id', '==', userId)
      .where('item', '==', item)
      .get();
      const data = res.docs[0];
      if (res.empty) {
        console.log('item in add to cart received',item)
        const id = uuid.v4();
        await firestore().collection('cart').doc(id).set({
          item: item,
          id: id,
          adder_id: userId,
          quantity: 1,
        });
        Alert.alert('added item successfully');
      } else {
        const quantity = data.data().quantity + 1;
        console.log(quantity);
        await firestore().collection('cart').doc(data.id).update({
          quantity: quantity,
        });
      }
      setLoader(false)
    } catch (error) {
      console.log('error in adding item to cart:', error);
    }
  };
  useEffect(() => {
    FetchData();
  }, []);
  //checking if user is login
  const CheckLogin = async (item) => {
    console.log('showing item for fun',item)
    const userId = await AsyncStorage.getItem('user_id');
    if (userId) {
      console.log('user is logged in directing to add to cart procedure')
      AddToCart(item, userId);
    } else {
      //opening modal
      setVisible(true);
    }
  };
  //renderer for flatlist
  const RenderItem = ({item}) => {
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
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <View style={styles.priceView}>
              <Text
                style={[styles.productPrice, {color: 'green', fontSize: 18}]}>
                PKR{' '}
              </Text>
              <Text style={styles.productPrice}>{item.price}</Text>
            </View>
          </View>
        </View>
        <View style={styles.itemButton}>
          <TouchableOpacity
            onPress={() => {
              CheckLogin(item);
            }}>
            <View style={styles.buttonStyle}>
              <Icon name="heart" size={25} color="black" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              CheckLogin(item);
            }}>
            <View style={styles.buttonStyle}>
              <Icon name="shopping-cart" size={30} color="black" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.mainView}>
      {loader &&
      <Loader></Loader>
      }
      {/* header of home  */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>
      {/* body of  */}
      <FlatList data={products} renderItem={RenderItem}></FlatList>
      <DialogLogin
        onCancel={() => {
          setVisible(false);
        }}
        onLoginSingUp={() => {
          navigation.navigate('Login');
        }}
        visible={visible}></DialogLogin>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: 'black',
    fontWeight: '500',
  },
  header: {
    height: 75,
    width: Dimensions.get('window').width,
    elevation: 4,
    paddingLeft: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  // body: {
  //   width: '100%',
  //   height: '100%',
  //   alignItems: 'center',
  // },
  productItem: {
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
  productPrice: {
    color: 'black',
    fontSize: 15,
    fontWeight: '600',
  },
  itemButton: {
    height: '100%',
    width: 80,
    backgroundColor: 'transparent',
    position: 'absolute',
    right: 0,
  },
  buttonStyle: {
    with: 80,
    height: 50,
    justifyContent: 'center',
    // backgroundColor:'green',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  // body: {
  //   height: Dimensions.get('window').height - 155,
  //   width: Dimensions.get('window').width,
  //   alignItems: 'center',
  //   // backgroundColor:'red',
  // },
});

export default Home;
