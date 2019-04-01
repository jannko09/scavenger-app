import React from 'react';
import { Text, View, TouchableOpacity, Alert, Dimensions, Image } from 'react-native';
import { FaceDetector, Camera, Permissions, BarCodeScanner } from 'expo';


export default class CatchTheRabbit extends React.Component {
    constructor(props) {
        super(props)

        this.socket = this.props.socket;
        this.data = this.props.data;

        this.socket.on('increasescore', function(data) {
                
                Alert.alert("Your team has found all the rabbits! Congratulations!")
                this.props.nav(data);
                //this.props.navigation.navigate('Game', {socket: this.socket, data: data})
                
        }.bind(this))

        this.socket.on('rabbitgame', function (data) {
            if (data.error) {
                Alert.alert(data.error)
            } else if (data.users) {
                Alert.alert("Your team catched a rabbit!!")
               
                this.setState({
                    rabbits: data.rabbits
                })
            }
        }.bind(this))
        /*

        REPLACE THE BELOW CODE WITH A NEW this.socket.on('') function, to redirect the players when game ends.

        this.socket = props.socket; // changed

        this.socket.on('groupjoin', function (data) {
            if (data.error) {
                Alert.alert(data.error)
            } else if (data.groupname) {
                props.teamWait(data); // changed
                this.setState({
                    hasCameraPermission: null,
                    type: Camera.Constants.Type.back,
                    barcodeScanning: false,
                })
            }
        }.bind(this))
        */
        this.state = {
            hasCameraPermission: null,
            type: Camera.Constants.Type.back,
            barcodeScanning: true,
            height: 0,
            width: 0,
            x: 0,
            y: 0,
            opacity: 0,
            faceDetecting: true,
            users: this.data.users,
            rabbits: 0
        };
    }
    static navigationOptions = {
        header: null
    }

    async componentWillMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    toggleBarcodeScanning = () => this.setState({ barcodeScanning: !this.state.barcodeScanning });

    onFacesDetected = (faces) => {
        if (faces.faces.length>0) {
            
            // add this.socket.emit('') here!

            this.setState({ 
                opacity: 1,
                height: faces.faces[0].bounds.size.height,
                width: faces.faces[0].bounds.size.width,
                left: faces.faces[0].bounds.origin.x,
                top: faces.faces[0].bounds.origin.y,
             });
        }
        else {
            this.setState({ opacity: 0 });
        }
        console.log(this.state.height);
        
    };

    renderMoreOptions = () =>
        (
            <View style={styles.options}>
                <View style={styles.detectors}>
                    <TouchableOpacity onPress={this.toggleBarcodeScanning}>
                        <MaterialCommunityIcons name="barcode-scan" size={32} color={this.state.barcodeScanning ? "white" : "#858585"} />
                    </TouchableOpacity>
                </View>
            </View>
        );


    render() {
        // qr-code button if not join camera
        let infoText = "Catch the Rabbit! Tip: Point the camera around :) Rabbits caught: " + this.state.rabbits + '/' + this.state.users;
        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <View style={{ height: 150, paddingTop: 50, paddingLeft: 20, paddingRight: 20, paddingBottom: 20, backgroundColor: '#ff9d0a' }}><Text style={{ color: 'black', fontSize: 20 }} numberOfLines={3}>{infoText}</Text>
                    </View>
                    <Camera
                        style={{ flex: 1 }}
                        type={this.state.type}
                        ref={ref => {
                            this.camera = ref;
                        }}
                        onCameraReady={this.collectPictureSizes}
                        type={this.state.type}
                        flashMode={this.state.flash}
                        autoFocus={this.state.autoFocus}
                        zoom={this.state.zoom}
                        whiteBalance={this.state.whiteBalance}
                        ratio={this.state.ratio}
                        pictureSize={this.state.pictureSize}
                        onMountError={this.handleMountError}
                        onFacesDetected={this.state.faceDetecting ? this.onFacesDetected : undefined}

                        faceDetectorSettings={{
           
                          mode: FaceDetector.Constants.Mode.fast,
           
                          detectLandmarks: FaceDetector.Constants.Mode.none,
           
                          runClassifications: FaceDetector.Constants.Mode.none,
           
                        }}
                        onFaceDetectionError={this.onFaceDetectionError}
                        barCodeScannerSettings={{
                            barCodeTypes: [
                                BarCodeScanner.Constants.BarCodeType.qr,
                                BarCodeScanner.Constants.BarCodeType.code128
                            ],
                        }}
                        onBarCodeScanned={this.state.barcodeScanning ? this.onBarCodeScanned : undefined}
                    >

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                   style={{
                                    // flex: 0.2,
                                    // alignSelf: 'flex-end',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#6EC5B8',
                                    padding: 10,
                                    margin: 10
                                  }}
                                onPress={() => {
                                    if (this.state.opacity === 1) {
                                        this.socket.emit('rabbitgame');
                                    }

                                    //this.setState({ barcodeScanning: true });
                                }}>
                                <Text
                                   style={{ fontSize: 18, color: 'white' }}>
                                    {' '}CATCH!{' '}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Image
                            style={{
                                opacity: this.state.opacity,
                                height: this.state.height,
                                width: this.state.width,
                                left: this.state.left,
                                top: this.state.top,
                                resizeMode: 'stretch',
                                position: 'absolute'
                            }}
                            source={require('../assets/rabbit.png')}
                        />
                    </Camera>
                </View>
            );
        }
    }
}

