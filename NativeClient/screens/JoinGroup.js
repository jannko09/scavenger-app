import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import CameraExample from '../components/CameraExample';


export default class JoinGroup extends React.Component {
    constructor(props) {
        super(props)
        this.socket = props.navigation.state.params.socket;
        this.join = props.navigation.state.params.join;
        this.state = {
            isFocused: false
        }
    }
    static navigationOptions = {
        header: null
    }

    componentDidMount() {
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.setState({ isFocused: true })
            }),
            this.props.navigation.addListener("willBlur", () => {
                this.setState({ isFocused: false })
            })
        ];
    }

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    }

    goBack=()=>{
        this.props.navigation.goBack();
    }
    
    teamWait=(data)=>{
        console.log(data);
        if (data.state==2){
            this.props.navigation.navigate('Game', {socket:this.socket, data:data})
        } else{
        this.props.navigation.navigate('TeamWait', { socket: this.socket, data: data })
        }
    }

    render() {
        return (
            <CameraExample goBack={this.goBack} join={this.join} socket={this.socket} teamWait={this.teamWait} isFocused={this.state.isFocused}/>
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