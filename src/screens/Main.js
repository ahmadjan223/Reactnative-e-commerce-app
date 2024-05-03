import {View, Text, StyleSheet} from 'react-native';
import React,{useState} from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import Home from './bottomTabs/Home';
import Cart from './bottomTabs/Cart';
import Search from './bottomTabs/Search';
import User from './bottomTabs/User';
const Main = ({navigation}) => {
  const [activeTab,setActiveTab]= useState(1)
  const ActiveTabColor = 'green' 
  const tabColor = 'black'
  return (
    <View style={styles.mainView}>
      <View style={styles.tabView}>

        {activeTab==1 && <Home></Home>}
        {activeTab==2 && <Search></Search>}
        {activeTab==3 && <Cart></Cart>}
        {activeTab==4 && <User></User>}
      </View>
      {/* Bottom navigation */}
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.tab} onPress={()=>{setActiveTab(1)}}>
          <Icon name="home" size={40} color={activeTab==1 ? ActiveTabColor:tabColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={()=>{setActiveTab(2)}}>
          <Icon name="search" size={40} color= {activeTab==2 ? ActiveTabColor:tabColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={()=>{setActiveTab(3)}}>
          <Icon name="shopping-cart" size={40} color={activeTab==3 ? ActiveTabColor:tabColor}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab} onPress={()=>{setActiveTab(4)}}>
          <Icon name="user-circle-o" size={40} color={activeTab==4 ? ActiveTabColor:tabColor}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#D3D3D3',

  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontSize: 20,
  },
  bottomView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width:'100%',
    height:80,
    alignSelf:'center',
    backgroundColor: 'white',
    // position: 'absolute',
    bottom: 0,
    elevation: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  tabView:{
    flex:1,
    // backgroundColor:'green',
  },
  tab: {
    // backgroundColor: 'red',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});
export default Main;
