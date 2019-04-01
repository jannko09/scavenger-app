import React from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Text } from 'react-native';
import BackButton from '../components/BackButton';
import CreateGroupButton from '../components/CreateGroupButton';
import JoinGroupButton from '../components/JoinGroupButton';



export default class MainMenu extends React.Component {
    constructor(props) {
        super(props)

        this.socket = props.navigation.state.params.socket;

        this.socket.on('uservalidation', function (data) {
            if (data.error) {
                Alert.alert(data.error)
            } else if (data.username) {
                Alert.alert(data.username)
            }
        })
        
    }

    static navigationOptions = {
        header: null
    }

    goBack=()=>{
        this.props.navigation.goBack();
    }

    joinGroup=()=>{
        this.props.navigation.navigate('Join', {socket:this.socket, join:true})
    }

    createGroup=()=>{
        this.props.navigation.navigate('Create', {socket:this.socket})
    }

    testSocket=()=>{
        console.log(this.socket.io.engine.id)
        var data = {
            username: "testitesti"
        }
        this.socket.emit('validateuser', data);
    }
    render() {
        return (
            <View style={styles.container}>
                <BackButton style={styles.button} goBack={this.goBack}/>
                <View >
                    <JoinGroupButton joinGroup ={this.joinGroup}/>
                    <CreateGroupButton createGroup = {this.createGroup}/>
                </View>
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
          width: 270, height: 80,
          padding: 10,
          margin: 10
        }
  });