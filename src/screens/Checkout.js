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
  useAnimatedValue,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import Loader from './Loader';
// import Loader from './Loader';
export default function Checkout() {
  const UserIdCall = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    console.log(userId);
    setUserId(userId);
  };
  const [userId, setUserId] = useState('');
  const navigation = useNavigation();
  const [cartList, setCartList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [visible, setvisible] = useState(false);
  const [total, settotal] = useState(0);
  const [qty, setQty] = useState(0);
  const GetTotal = () => {
    try {
      const temp = cartList;
      let total = 0;
      setQty(temp.length);
      temp.map(item => {
        total += item.item.price * item.quantity;
      });
      settotal(total);
    } catch (error) {
      console.log('error in getting checkout total', error);
    }
  };
  const GetAddress = async userId => {
    try {
      const address = await firestore()
        .collection('address')
        .where('adder_id', '==', userId)
        .where('default', '==', true)
        .get();
      const data = address.docs[0].data();
      setSelectedAddress(
        data.address + ',' + data.city + ',' + data.hint + ',' + data.post_code,
      );
      console.log(
        data.address + ',' + data.city + ',' + data.hint + ',' + data.post_code,
      );
    } catch (error) {
      console.log('error in geting adress', error);
    }
  };
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
  useEffect(() => {
    const SnapFunction = async () => {
      await UserIdCall();
      const userId = await AsyncStorage.getItem('user_id');

      const unsubscribe = firestore()
        .collection('cart')
        .where('adder_id', '==', userId)
        .onSnapshot(() => {
          FetchData(userId);
          GetTotal();
          GetAddress(userId);
        });

      return () => {
        // Unsubscribe when the component unmounts
        unsubscribe();
      };
    };
    SnapFunction();
  }, []);
  // useIsFocused(async () => {
  //   const userId = await AsyncStorage.getItem('user_id');
  //   FetchData(userId);
  //   GetTotal();
  //   GetAddress(userId);
  // });
  const FetchData = async userId => {
    try {
      setvisible(true);

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
  const PayNow = () => {
    const temp = cartList;
    try {
      setvisible(true);
      if (!selectedAddress.empty) {
        temp.map(async item => {
          const id = uuid.v4();
          await firestore().collection('order').doc(id).set({
            item: item,
            delivery: selectedAddress,
            id: id,
          });
          await firestore()
              .collection('cart')
              .doc(item.id)
              .delete();
        });
      } else {
        Alert.alert('select address first');
      }
      setvisible(false);
    } catch (error) {
      console.log('error in order generating', error);
    }
    navigation.navigate('Main');
  };
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
      <Text style={styles.heading}>item added</Text>
      <FlatList
        style={{flexGrow: 0, alignSelf: 'center'}} // Add this style to limit the height
        data={cartList}
        renderItem={RenderItem}
      />
      <View style={styles.totalView}>
        <Text style={styles.heading}>items: {qty}</Text>
        <Text style={[styles.heading, {paddingEnd: 10}]}>total: {total}</Text>
      </View>
      <View
        style={{
          height: 1,
          width: '90%',
          alignSelf: 'center',
          backgroundColor: '#6e6e6e',
          margin: 10,
        }}></View>
      <View style={styles.totalView}>
        <Text style={styles.heading}>adress</Text>
        <Text
          onPress={() => {
            navigation.navigate('Adress');
          }}
          style={[
            styles.heading,
            {paddingEnd: 10, textDecorationLine: 'underline', color: 'green'},
          ]}>
          adress
        </Text>
      </View>
      <Text style={styles.selectedAdress}>
        {selectedAddress.empty ? 'no address selected' : selectedAddress}
      </Text>
      <TouchableOpacity
        onPress={() => {
          PayNow();
        }}
        style={styles.buttonPay}>
        <Text style={styles.buttonText}>pay now</Text>
      </TouchableOpacity>
      {/* <Text style={styles.heading}>Address</Text> */}
      {visible && <Loader></Loader>}
    </View>
  );
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#D3D3D3',
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
  heading: {
    color: 'black',
    // height:60,
    fontSize: 22,
    fontWeight: '600',
    margin: 5,
    paddingLeft: 10,
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedAdress: {
    color: 'black',
    paddingLeft: 15,
    paddingTop: 5,
  },
  buttonPay: {
    marginTop: 30,
    height: 50,
    width: '95%',
    backgroundColor: 'green',
    alignSelf: 'center',
    elevation: 4,
    borderRadius: 15,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
  },
});
