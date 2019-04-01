import React from 'react';
import { Text, View, TouchableOpacity, Alert, Button, StyleSheet } from 'react-native';
import { Camera, Permissions, BarCodeScanner } from 'expo';


export default class CreateGroupButton extends React.Component {
  state = {

  };

  render() {

      return (
        <TouchableOpacity
        onPress={this.props.createGroup}
        style={styles.button}
        >
          <Text style= {{color:'#fff', fontSize: 40, fontWeight: 'bold'}}>Create Group</Text>
        </TouchableOpacity>
        
      )
    }

}


const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    width: 270, height: 80,
    padding: 10,
    margin: 10
}
})
