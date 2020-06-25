import React, { useState, useEffect } from "react";
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity
 } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { requestPermissionsAsync,  getCurrentPositionAsync } from "expo-location";
import { MaterialIcons} from '@expo/vector-icons';

import api from '../services/api';

function Main( {navigation} ) {
  const [currentRegion, setCurrentRegion] = useState(null);
  const [devs, setDevs] = useState([]);
  const [techs, setTechs] = useState();

  useEffect(() => {
    async function loadIinitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 1.0,
          longitudeDelta: 1.0
        });
      }
    }
    loadIinitialPosition();
  }, []);

  async function loadDevs(){
      const {latitude, longitude } = currentRegion;

       console.log(api.options);
         const response = await api.get("/devs" 
        //  ,
        //  {
        //     params: {
        //         latitude,
        //         longitude,
        //         techs
        //     } 
        // }
        )
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      });
      setDevs(response.data.devs);            
  }

  function handleRegionChanged(region){
      setCurrentRegion(region);

  }

  if (!currentRegion) {
    return null;
  }
  return (
  <>    
  <MapView 
       onRegionChangeComplete={handleRegionChanged} 
       initialRegion={currentRegion} 
       style={styles.map}>

       {devs.map(dev => (
            <Marker 
                key= {dev._id} 
                coordinate={{
                        longitude:dev.location.coordinates[0], 
                        latitude: dev.location.coordinates[1]
                        }
                }>
                <Image 
                style={styles.avatar} 
                source={{uri:dev.avatar_url}}  />

                <Callout 
                    onPress= {()=>{
                    navigation.navigate('Profile',{github_username:dev.github_username});
                }}>
                    <View style={styles.callout}>
                        <Text style={styles.devName}>
                            {dev.name}
                        </Text>
                        <Text style={styles.devBio} > 
                         {dev.bio}
                        </Text>
                        <Text style={styles.devTechs}>
                            {dev.techs.join(', ')} 
                        </Text>

                    </View>
                </Callout>
            </Marker>

           
       ))}    
  </MapView>
  <View style={styles.searchForm}>
      <TextInput 
        style={styles.searchInput}
        placeholder="Busca devs por Techs"
        placeholderTextColor="#999"
        autoCapitalize="words"
        autoCorrect={false}
         value = {techs}
         onChangeText = { setTechs}
      />
      <TouchableOpacity onPress={loadDevs} style={styles.loadButton}>
        <MaterialIcons name='my-location' size={20} color="#FFF" />  
      </TouchableOpacity>

  </View>
  </>
  )
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  avatar: {
      width: 54,
      height: 54,
      borderRadius: 4,
      borderWidth: 4,
      borderColor: '#FFF',
  },
  callout:{
      width: 260,
  },
  devName:{
      fontWeight:"bold",
      fontSize: 16,
  },
  devBio : {
      color:'#666',
      marginTop: 2,
  },
  devTechs:{
      marginTop:2,
      fontWeight:'bold',
  },
  searchForm:{
      position: 'absolute',
      top:20,
      left:20,
      right:20,
      zIndex:5,
      flexDirection: 'row',

  },
  searchInput:{
      flex:1,
      height:50,
      backgroundColor:'#fff',
      color:'#333',
      borderRadius:25,
      paddingHorizontal:20,
      fontSize:16,
      shadowColor:'#000',
      shadowOpacity: 0.2,
      shadowOffset:{
          width: 4,
          height: 4,
      },
      elevation: 2,
  },
  loadButton:{
      width:50,
      height:50,
      backgroundColor:'#8E4DFF',
      borderRadius:25,
      justifyContent: 'center',
      alignItems:'center',
      marginLeft:15,
  },


});

export default Main;
