import React, { Component } from 'react';
import { Alert, View, Text, Vibration, StyleSheet } from 'react-native';
import { Camera, BarCodeScanner, Permissions } from 'expo';

export default class ExpoScanner extends Component {
  constructor(props) {
    super(props);


    this.onBarCodeRead = this.onBarCodeRead.bind(this);
    this.renderMessage = this.renderMessage.bind(this);
    this.scannedCode = null;

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      id_cedulacli: '',
            placa:'',
            monto:'', 
            fecha_pago:'Seleccione fecha'   
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    await this.setState({hasCameraPermission: status === 'granted'});
    await this.resetScanner();
  }

  multaEdit = ({data, type}) =>{

    if ((type === this.state.scannedItem.type && data === this.state.scannedItem.data) || data === null) {
      return;
    }

    this.setState({ scannedItem: { data, type } });

    const {placa} = this.state;
    const {monto} = this.state;
    const {fecha_pago} = this.state;

    Vibration.vibrate();

    console.log(`EAN scanned: ${data}`);


  fetch('http://10.10.20.88/parciall/editarMul.php', {
    method: 'post',
    header:{
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },          
    body:JSON.stringify({
      placa: placa,
      monto: monto,
      id_cedulacli: ''+`${data}`,
      fecha_pago: fecha_pago,
    })

  })
  .then((response) => response.json())
    .then((responseJson) =>{
      if(responseJson == "Actualización completada"){
        alert(responseJson);
        this.props.navigation.navigate("InicioScreen");
      }else{

        alert(responseJson);

      }             

          })

    .catch((error)=>{
      console.error(error);
    });

    this.props.navigation.navigate('Inicio', { ean: data });

  }

  renderAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => this.resetScanner() },
      ],
      { cancelable: true }
    );
  }

  onBarCodeRead({ type, data } ) {
    if ((type === this.state.scannedItem.type && data === this.state.scannedItem.data) || data === null) {
      return;
    }

    Vibration.vibrate();
    this.setState({ scannedItem: { data, type } });

      console.log(`EAN scanned: ${data}`);
  }

  renderMessage() {
    if (this.state.scannedItem && this.state.scannedItem.type) {
      const { type, data } = this.state.scannedItem;
      return (
        <Text style={styles.scanScreenMessage}>
          {`Scanned \n ${type} \n ${data}`}
        </Text>
      );
    }
    return <Text style={styles.scanScreenMessage}>Focus the barcode to scan.</Text>;
  }

  resetScanner() {
    this.scannedCode = null;
    this.setState({
      scannedItem: {
        type: null,
        data: null
      }
    });
  }

  render() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeScanned={this.multaEdit}
            style={StyleSheet.absoluteFill}
          />
          {this.renderMessage()}
        </View>
      </View>
    );
  }
}
