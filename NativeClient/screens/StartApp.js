import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import io from 'socket.io-client';

export default class StartApp extends React.Component {
    constructor(props) {
        super(props)

        this.socket = io('https://loppuprojekti.herokuapp.com/', {transports: ['websocket']});

        this.socket.on('uservalidation', function (data) {
            if (data.error) {
                Alert.alert(data.error)
            } else if (data.username) {
               props.navigation.navigate('MainMenu', {socket:this.socket})
            }
        }.bind(this))

        this.state = {
            text: 'Your name here',
        }

        this.sendUsername = this.sendUsername.bind(this);
    }
    static navigationOptions = {
        header: null
    }
    sendUsername() {
        console.log(this.socket.io.engine.id)
        var data = {
            username: this.state.text
        }
        this.socket.emit('validateuser', data);
        // Alert.alert(this.state.text);
    }

    render() {

        return (
            <View style={styles.container}>
                <Text style={{ 
                    fontWeight: 'bold',
                    fontSize: 40,
                    textAlign: 'center'
                    }}>
                    Welcome to the Scavenger hunt!
                </Text>
                <Text style={{
                    fontSize: 30, marginTop: 40
                }}>Please insert your name.</Text>
                <TextInput
                    style={{ textAlign:'center', fontSize: 30 , height: 50, width:200, borderColor: 'gray', borderBottomWidth: 1 }}
                    placeholder="Your name"
                    onChangeText={(text) => this.setState({ text })}
                    // value={this.state.text}
                />
                <TouchableOpacity
                    onPress={this.sendUsername}
                    title="Send username!"
                    style= {styles.button}
                ><Text style={{ color: '#fff'}}>CLICK ME</Text></TouchableOpacity>
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
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        width: 100, height: 50,
        padding: 10,
        margin: 10
    }

  });