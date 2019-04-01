import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import CameraExample from '../components/CameraExample';
import CatchTheRabbit from '../components/CatchTheRabbit';


export default class RabbitGame extends React.Component {
    constructor(props) {
        super(props)
        this.socket = props.navigation.state.params.socket;
        this.data = props.navigation.state.params.data;
        this.state = {
        }
    }

    static navigationOptions = {
        header: null
    }

    navi=(data)=>{
        this.props.navigation.navigate('Game', {socket: this.socket, data: data})
    }

    render() {
        return (
            <CatchTheRabbit socket={this.socket} data={this.data} nav={this.navi}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      height: 150
    },
  });