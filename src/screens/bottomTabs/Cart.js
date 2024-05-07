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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Loader from '../Loader';
// main component
const Cart = () => {
  const navigation = useNavigation();
  const [cartList, setCartList] = useState([]);
  const [visible, setvisible] = useState(false);
  const [total, settotal] = useState(0);
  const GetTotal = () => {
    try {
      const temp = cartList;
      let total = 0;
      temp.map(item => {
        total += item.item.price * item.quantity;
      });
      settotal(total);
    } catch (error) {
      console.log('error in getting checkout total', error);
    }
  };
  useEffect(() => {
    const SnapFunction = async () => {
      const userId = await AsyncStorage.getItem('user_id');
      const unsubscribe = firestore()
        .collection('cart')
        .where('adder_id', '==', userId)
        .onSnapshot(() => {
          FetchData(userId);
        });

      return () => {
        // Unsubscribe when the component unmounts
        unsubscribe();
      };
    };

    SnapFunction();
  }, []);
  useEffect(() => {
    GetTotal();
  }, [cartList]);
  //call for db to load products
  const FetchData = async userId => {
    try {
      const snapshot = await firestore()
        .collection('cart')
        .where('adder_id', '==', userId)
        .get();
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
      }));
      setCartList(data);
      setvisible(false);
    } catch (error) {
      console.log('error in fetching data');
    }
  };

  //Login of increasing the quantity of products
  const Increment = async item => {
    try {
      // setvisible(true);
      const quantity = item.quantity + 1;
      await firestore().collection('cart').doc(item.id).update({
        quantity: quantity,
      });
      console.log('increment successful');
      // setvisible(false);
    } catch (error) {
      console.log('error in Incrementing quantity', error);
    }
  };
  const Decrement = async item => {
    try {
      // setvisible(true);
      const quantity = item.quantity - 1;
      if (quantity > 0) {
        await firestore().collection('cart').doc(item.id).update({
          quantity: quantity,
        });
      } else {
        await firestore().collection('cart').doc(item.id).delete();
      }
      console.log('decrement successful');
      // setvisible(false);
    } catch (error) {
      console.log('error in Decrementing quantity', error);
    }
  };
  //getting total
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
            <Text style={styles.productName}>{item.item.name}</Text>
            <Text style={styles.productDescription}>
              {item.item.description}
            </Text>
            <View style={styles.priceView}>
              <Text
                style={[styles.productPrice, {color: 'green', fontSize: 18}]}>
                PKR{' '}
              </Text>
              <Text style={styles.productPrice}>{item.item.price}</Text>
            </View>
          </View>
        </View>
        <View style={styles.itemButton}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.buttonStyle}>
              <Icon name="heart" size={25} color="black" />
            </View>
          </TouchableOpacity>

          <View style={styles.quantityView}>
            <TouchableOpacity
              onPress={() => {
                Increment(item);
              }}>
              <View style={styles.triggerButton}>
                <Text style={styles.quantityButton}>+</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => {
                Decrement(item);
              }}>
              <View style={styles.triggerButton}>
                <Text style={styles.quantityButton}>-</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.mainView}>
      {/* header of home  */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
      </View>
      {/* body of  */}
      <View style={styles.body}>
        {!cartList.length && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'green',
            }}>
            {/* Ensure the text is wrapped within a Text component */}
            <Text>Cart is empty</Text>
          </View>
        )}
        {/* {cartList.length && (
          <FlatList data={cartList} renderItem={RenderItem}></FlatList>
        )} */}
      </View>
      {cartList.length > 0 && (
        <View style={styles.checkOut}>
          {/* Ensure both text strings are wrapped within Text components */}
          <Text style={styles.checkoutTotal}>Total : </Text>
          <Text style={styles.checkoutPrice}>RS {total}</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => {
              navigation.navigate('Checkout');
            }}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
      {visible && <Loader></Loader>}
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 30,
    color: 'black',
    fontWeight: '500',
  },
  header: {
    height: 75,
    width: Dimensions.get('window').width,
    // position: 'absolute',
    // top: 0,
    borderRadius: 20,
    elevation: 4,
    paddingLeft: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', // Align content both at the top and bottom
  },
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
    width: 100,
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
  quantityView: {
    marginRight: 5,
    with: 80,
    height: 50,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  triggerButton: {
    height: '90%',
    width: 35,
    backgroundColor: 'transparent',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
  },
  quantityText: {
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  quantityButton: {
    color: 'black',
    marginTop: 3,
    fontSize: 25,
    fontWeight: '600',
    flex: 1,
  },
  checkOut: {
    height: 50,
    marginBottom: 5,
    marginTop: 5,
    width: Dimensions.get('window').width - 20,
    alignSelf: 'center',
    // position: 'absolute',
    // bottom: 0 ,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'green',
  },
  checkoutTotal: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    paddingLeft: 25,
  },
  checkoutPrice: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    paddingLeft: 5,
  },
  checkoutButton: {
    borderColor: 'white',
    position: 'absolute',
    right: 10,
    borderWidth: 1,
    borderRadius: 15,
    padding: 7,
    alignSelf: 'center',
  },
  checkoutButtonText: {
    fontSize: 15,
    color: 'white',
  },
});
export default Cart;
// const list = await Promise.all(
//   snapshot.docs.map(async doc => {
//     const itemData = await firestore()
//       .collection('product')
//       .doc(doc.data().item_id)
//       .get();
//     console.log('each iteration', itemData);
//     return {
//       ...doc.data(),
//       item: itemData.data(),
//     };
//   }),
// );
