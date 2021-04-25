
import { Text, View, StyleSheet, Animated,FlatList, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import * as React from 'react';
import { Audio } from 'expo-av';
import { useState, useEffect,Button } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import {ExpoScanner} from './ExpoScanner'
import { BarCodeScanner } from 'expo-barcode-scanner';
export default function App() {
  const [t, sett] = useState(false);
  const [s, sets] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [sound, setSound] = React.useState();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('./assets/m.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync(); }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`You have ${data} minute`);
    sets(true);
    
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {t&&!s&&(<CountdownCircleTimer
        isPlaying
        duration={10}
        onComplete={() => {playSound();alert("your time over")}}
        colors={[
          ['#004777', 0.4],
          ['#F7B801', 0.4],
          ['#A30000', 0.2],
          
        ]}
    >
      {({ remainingTime, animatedColor }) => (
        <Animated.Text style={{ color: animatedColor, fontSize: 40 }}>
          {remainingTime}
        </Animated.Text>
      )}
    </CountdownCircleTimer>)}{
      !t&&!s&&( 
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        
     )
    }
{scanned &&!t&&!s &&<Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}{s&&(
<FlatList

          data={[
            { key: 'Free slot on 13:00' },
            { key: '13:30 is busy' },

          ]}
          renderItem={({ item }) => <TouchableOpacity onPress={(f)=>{alert("You took a slot on 13 00"); sett(true);sets(false)}}><Text style={styles.item}>{item.key}</Text></TouchableOpacity>}
        />)}
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  }, containerr: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  }
});
