import {View, Text, Modal, StyleSheet,Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';

const Loader = () => {
  return (
    <Modal visible = {true} transparent = {true}>
      <View style={styles.modalView}>
        <View style = {styles.mainView}>
            <ActivityIndicator size={30} color={'grey'}></ActivityIndicator>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalView: {
    width: Dimensions.get('window').width ,
    height: Dimensions.get('window').height ,
    backgroundColor:'rgba(0,0,0,0.5)',
    justifyContent:'center',
    alignItems:'center',
  },
  mainView:{
    padding:20,
    backgroundColor:'white',
    borderRadius:10,
    alignItems:'center',
    justifyContent:'space-evenly',
  },
  });
export default Loader;
