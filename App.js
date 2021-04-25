
import { Text, View, StyleSheet, Animated } from 'react-native';
import Constants from 'expo-constants';
import * as React from 'react';
import { useState, useEffect,Button } from 'react';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import {ExpoScanner} from './ExpoScanner'
import { BarCodeScanner } from 'expo-barcode-scanner';
export default function App() {
  const [t, sett] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`You have ${data} minute`);
    sett(true);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      {t&&(<CountdownCircleTimer
        isPlaying
        duration={60}
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
      !t&&( 
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        
     )
    }
{scanned &&!t&& <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
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
