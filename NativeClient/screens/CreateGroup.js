import React from 'react';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';

export default class CreateGroup extends React.Component {
    constructor(props) {
        super(props)

        this.socket = props.navigation.state.params.socket;

        this.socket.on('groupvalidation', function (data) {
            if (data.error) {
                Alert.alert(data.error)
            } else if (data.groupname) {
        
               props.navigation.navigate('TeamJoin', {socket:this.socket, data: data})
            }
        }.bind(this))

        this.state = {
            text: 'Groupname',
        }

        this.createNewGroup = this.createNewGroup.bind(this);
    }
    static navigationOptions = {
        header: null
    }
    createNewGroup() {
        console.log(this.socket.io.engine.id)
        var data = {
            groupName: this.state.text
        }
        this.socket.emit('newgroup', data);
        // Alert.alert(this.state.text);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={{fontWeight:'bold', textAlign:'center', fontSize: 30, marginTop: 40}}>Select your groups name!</Text>
                <TextInput
                    style={{ textAlign:'center', fontSize: 30, height: 50, width:200, borderColor: 'gray', borderBottomWidth: 1 }}
                    onChangeText={(text) => this.setState({ text })}
                    placeholder='Group name'
                />
                <TouchableOpacity 
                    onPress={this.createNewGroup}
                    title="Send groupname!"
                    style= {styles.button}
                ><Text style={{color: '#fff'}}>CLICK ME</Text></TouchableOpacity>
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