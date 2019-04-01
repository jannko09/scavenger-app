import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';

export default class CodeGen extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            valueForBarCode: "" + this.props.bar,
            valueForQRCode: "" + this.props.qr,
        }
    }
    static navigationOptions = {
        header: null
    }

    render() {
        return (
            <View style={styles.container}>

                <Barcode value={this.state.valueForBarCode} format="CODE128" background="#ff9d0a"/>
                <QRCode
                    value={this.state.valueForQRCode}
                    //Setting the value of QRCode
                    size={150}
                    //Size of QRCode
                    bgColor="#000"
                    //Backgroun Color of QRCode
                    fgColor="#ff9d0a"
                //Front Color of QRCode
                />
            </View >
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff9d0a',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        // height: 150,
    },
    infoText: {
        margin: 20,
        padding: 10
    }
});