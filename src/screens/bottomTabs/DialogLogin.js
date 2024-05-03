import {View, Text, Modal, StyleSheet,Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';

const DialogLogin = ({onCancel,onLoginSingUp,visible}) => {
  return (
    <Modal visible = {visible} transparent = {true}>
      <View style={styles.modalView}>
        <View style = {styles.mainView}>
          <Text style={styles.modalText}>Want to add product to cart please login/signup first</Text>
          <TouchableOpacity 
          style ={styles.Button}
          onPress={()=>{onLoginSingUp()}}
          >
            <Text style={[styles.modalText,{color:'white'}]}>Login/Signup</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={()=>{onCancel()}}
          style ={[styles.Button,{backgroundColor:'grey'}]}
          >
            <Text style={[styles.modalText,{color:'white'}]}>Cancel</Text>
          </TouchableOpacity>
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
    width:'90%',
    height:200,
    backgroundColor:'white',
    borderRadius:10,
    alignItems:'center',
    justifyContent:'space-evenly',
  },
  modalText:{
    fontSize:20,
    color:'black',
    textAlign:'center',
    fontWeight:'600',
  },
  Button:{
    backgroundColor:'green',
    width:'75%',
    height:50,
    elevation:5,
    borderRadius:10,
    alignItems:'center',
    justifyContent:'center',
  }
});
export default DialogLogin;
