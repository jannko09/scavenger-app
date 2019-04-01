import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';

export default class GameEnd extends React.Component {
    static navigationOptions = {
        header: null
    }
    state = {
    }
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.info}>CONGRATULATIONS! YOU HAVE WON THE GAME!</Text>
                <Image style={{width:200, height: 200, marginTop: 50}} source={require('../assets/testicon.png')}></Image>
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
    info:{
        margin:10,
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold'
    }
});