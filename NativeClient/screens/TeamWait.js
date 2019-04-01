

import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'react-native-elements';
import QRCode from 'react-native-qrcode';
import Barcode from 'react-native-barcode-builder';
import CodeGen from '../components/CodeGen';


export default class TeamWait extends React.Component {
    constructor(props) {
        super(props)

        this.socket = props.navigation.state.params.socket;
        this.data = props.navigation.state.params.data;

        this.socket.on('letsplay', function (data) {
            this.props.navigation.navigate('Instructions', { socket: this.socket, data: this.data })
        }.bind(this))

        this.state = { // added QR and Bar
            valueForBarCode: "" + this.data.groupId,
            valueForQRCode: "" + this.data.groupId
        }
    }
    static navigationOptions = {
        header: null
    }

    teamReady = () => {
        this.props.navigation.navigate('Game', { socket: this.socket, data: this.data })
    }

    /* {id:1, imgUri: require(`../images/1.png`)}
    search for the right imgUri with the id.  */

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.infoText}>
                    <Text>SHOW THIS TO YOUR TEAM TO JOIN YOUR GROUP!</Text>
                </View>    
                <View style={styles.code}>
                    <CodeGen qr={this.state.valueForQRCode} bar={this.state.valueForBarCode} />
                </View>
                <View>
                    <Text>WAITING FOR TEAM... HOLD TIGHT!</Text>
                </View>
            </View>
        );
    }
}
/*
         <Barcode value={this.state.valueForBarCode} format="CODE128" />
                <QRCode
                    value={this.state.valueForQRCode}
                    //Setting the value of QRCode
                    size={150}
                    //Size of QRCode
                    bgColor="#000"
                    //Backgroun Color of QRCode
                    fgColor="#fff"
                //Front Color of QRCode

                />
*/
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ff9d0a',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        height: 150,
    },
    infoText: {
        textAlign: 'center',
        alignItems: 'center'
    },
    code:{
        flex: 0.5
    }
});