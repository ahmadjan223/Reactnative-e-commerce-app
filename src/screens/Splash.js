import { View, Text,StyleSheet } from 'react-native'
import React, {useEffect}  from 'react'
import {useNavigation} from '@react-navigation/native'

const Splash = () => {
    const navigation = useNavigation()
    useEffect(()=>{
        // to navigate to main page
        setTimeout(()=>{
            navigation.navigate('Main')
        },3000)
    },[])
  return (
    <View style={styles.mainView}>
      <Text
      style = {styles.text}
      >Splash</Text>
    </View>
  )
}
//styles
const styles = StyleSheet.create({
    mainView:{
        flex:1,
        backgroundColor:'cyan',
        justifyContent:'center'
    },
    text:{
        textAlign:'center',
        color:'white',
        fontSize:40,
        fontWeight:'900',
    }
})
export default Splash