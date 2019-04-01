import React from 'react';
import { StyleSheet, Text, View, Alert} from 'react-native';
import { Image } from 'react-native-elements';


export default class Instructions extends React.Component {
    constructor(props) {
        super(props)

        this.socket = props.navigation.state.params.socket;
        this.data = props.navigation.state.params.data;

        this.socket.on('startgame', function(data){
            this.props.navigation.navigate('Game', { socket: this.socket, data: this.data })
        }.bind(this))
    }
    static navigationOptions = {
        header: null
    }


    /* {id:1, imgUri: require(`../images/1.png`)}
    search for the right imgUri with the id.  */

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Game instructions:</Text>
                <Text style={styles.text}>  1.You will get a clue about QR-code location</Text>
                <Text style={styles.text}>  2. Find the right QR code and scan it</Text>
                <Text style={styles.text}>  3. You will get a new clue for a new QR code</Text>
                <Text style={styles.text}>  4. After you have successfully found 2 QR codes and scanned them, and completed some games, you win!</Text>
                <Text style={styles.text}>WAITING FOR ADMIN TO START THE GAME...</Text>
            </View>
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
        height: 150,
    },
    text:{
        margin: 10,
        fontSize: 20,
        textAlign: 'center'
    },
    header:{
        margin: 10,
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    wait:{
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});