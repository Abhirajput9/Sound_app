import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { BellSvg, HeadPhoneIconSvg} from '../../../assets/icons/icons'
import VoiceRecorder from './voice-recorder'
import { Icons } from '../../../assets/images'

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <View style={styles.applogoIcon}>
          <HeadPhoneIconSvg/>
          <Text style={styles.appText}>Audio</Text>
        </View>
        <View style={styles.profileContainer}>
          <BellSvg/>
          <Image style={styles.profileImage} source={Icons.profile}></Image>
        </View>
      </View>
      <VoiceRecorder/>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  headerContent: {
    backgroundColor:"white",
    alignSelf: "center",
    width: "100%",
    height: 65,
    alignItems:"center",
    flexDirection:"row",
    justifyContent:"space-between",
    paddingHorizontal:"5%"
  },
  applogoIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
  logoIcon: {
    height: 30,
    width: 30,
  },
  appText: {
    fontWeight: "700",
  },
  profileContainer:{
    flexDirection:"row",
    alignItems: "center",
    justifyContent:"space-between",
    gap:"4%"
  },
  profileImage:{
    width:40,
    height:40,
    borderRadius:100,
  }
})