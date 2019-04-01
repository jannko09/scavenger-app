import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from 'react-native';
import CodeGen from '../components/CodeGen';



export default class TeamJoin extends React.Component {
    constructor(props) {
        super(props)

        this.socket = props.navigation.state.params.socket;
        this.data = props.navigation.state.params.data;

        console.log(this.data);

        this.state = {
            valueForBarCode: "" + this.data.groupId,
            valueForQRCode: "" + this.data.groupId,
            groupSize: this.data.playerCount,
            notEnoughPlayers: true

        }

        this.socket.on('groupjoin', function (data) {
            this.setState({ groupSize: data.playerCount });
            console.log();
            if (this.state.groupSize > 2) {
                this.setState({ notEnoughPlayers: false })
            }
        }.bind(this))

        this.socket.on('letsplay', function (data) {
            this.props.navigation.navigate('Instructions', { socket: this.socket, data: this.data, groupSize: this.state.groupSize })
        }.bind(this))

    }
    static navigationOptions = {
        header: null
    }

    teamReady = () => {
        this.socket.emit('groupready');
    }


    render() {
        let okBtn = this.state.notEnoughPlayers === true ? <TouchableOpacity style={styles.notReadyButton} disabled={true} onPress={this.teamReady} title="Team Ready" ><Text>Waiting for team members!</Text></TouchableOpacity> : <TouchableOpacity style={styles.button} onPress={this.teamReady} title="Team Ready" ><Text>OK, ready for the game!</Text></TouchableOpacity>;

        return (
            <View style={styles.container}>

                <View style= {styles.infoText} >
                    <Text>SHOW THIS TO YOUR TEAM TO JOIN YOUR GROUP!</Text>
                    <Text>You need at least 3 people in your team:</Text>
                    <Text>Group size: {this.state.groupSize}</Text>
                </View>
                <View style={styles.code}>
                    <CodeGen qr={this.state.valueForQRCode} bar={this.state.valueForBarCode} />
                </View>
                <View style={styles.infoText}>
                    <Text >Click OK when your group has scanned the QR-code.</Text>
                    {okBtn}
                </View>
            </View >
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
        alignItems: 'center',
        fontWeight: 'bold'
    },
    code:{
        margin: 20,
        flex: 0.5
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#53e028',
        padding: 10,
        margin: 10
      },
    notReadyButton: {
        alignItems: 'center',
        backgroundColor: '#e00606',
        padding: 10,
        margin: 10
      }
});