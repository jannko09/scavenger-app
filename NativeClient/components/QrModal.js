import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View, Alert, StyleSheet} from 'react-native';
import CodeGen from './CodeGen';

export default class QrModal extends Component {
  state = {
    modalVisible: false,
  };

  setModalVisible=(visible)=> {
    this.setState({modalVisible: visible});
  }

  handleCloseModal=()=>{
    this.setState({modalVisible:false})
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          >
          <View style={styles.container}>
            <View style={styles.infoText}>
              <Text>Did your team mate drop out of game? Let them scan this QR code and get back in the game!</Text>
            </View>
            <View style={styles.code}>
              <CodeGen bar = {this.props.data.groupId} qr ={this.props.data.groupId}></CodeGen>
            </View>
            <TouchableHighlight
                style= {styles.button}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}
                onRequestClose={this.handleCloseModal}>
                <Text style={{color:'#fff'}}>Return to Game</Text>
            </TouchableHighlight>

          </View>
        </Modal>

        <TouchableHighlight
            style={styles.button}
            onPress={() => {
                this.setModalVisible(true);
            }}>
          <Text style={{color:'#fff'}}>Team QR Code</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    button: {
      alignItems: 'center',
      backgroundColor: '#000000',
      padding: 10,
      margin: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#ff9d0a',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        // height: 150,
    },
    code:{
      flex: 0.5
    },
    infoText: {
      textAlign: 'center',
      alignItems: 'center'  
    },
  });