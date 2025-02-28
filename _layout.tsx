/******************************************************************************\

                  This file is part of the Buildbotics firmware.

         Copyright (c) 2015 - 2023, Buildbotics LLC, All rights reserved.

          This Source describes Open Hardware and is licensed under the
                                  CERN-OHL-S v2.

          You may redistribute and modify this Source and make products
     using it under the terms of the CERN-OHL-S v2 (https:/cern.ch/cern-ohl).
            This Source is distributed WITHOUT ANY EXPRESS OR IMPLIED
     WARRANTY, INCLUDING OF MERCHANTABILITY, SATISFACTORY QUALITY AND FITNESS
      FOR A PARTICULAR PURPOSE. Please see the CERN-OHL-S v2 for applicable
                                   conditions.

                 Source location: https://github.com/buildbotics

       As per CERN-OHL-S v2 section 4, should You produce hardware based on
     these sources, You must maintain the Source Location clearly visible on
     the external case of the CNC Controller or other product you make using
                                   this Source.

                 For more information, email info@buildbotics.com

\******************************************************************************/

import React, { useState } from 'react';
import { View, Image, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { RadioButton } from 'react-native-paper';

// Define the types for the props passed from the main app
type LayoutProps = {
  onConnect: (ipAddress: string) => void;
  hostName: string;
  machineState: string;
  jog: (axis: string, speed: number) => void;
};

const Layout: React.FC<LayoutProps> = ({
    onConnect,
    hostName,
    machineState,
    jog,
 }) => {
  const [ipAddress, setIpAddress] = useState<string>('');
  const [selectedButton, setSelectedButton] = useState<string>('X');
  const [speedValue, setSpeedValue] = useState<number>(0.25);

  const stepValues = [
    0, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1];

  const speed = ((up: boolean) => {
    let newVal;
    let index = stepValues.indexOf(speedValue);
    if (up) {
      newVal = index <  stepValues.length - 1 ? stepValues[index + 1] : 1;
    } else {
      newVal = index === 0 ? 0 : stepValues[index - 1];
    }
    setSpeedValue(newVal);
  });

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.connectButton} onPress={() => onConnect(ipAddress)}>
          <Text style={styles.buttonText}>Connect</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.ipInput}
          placeholder="Enter IP address"
          keyboardType="numeric"
          value={ipAddress}
          onChangeText={setIpAddress}  // Updates ipAddress state
        />
      </View>

      {/* Status Bar with Two Label Fields */}
      <View style={styles.statusBar}>
        <View style={styles.statusLabel}>
          <Text style={styles.statusText}>{hostName}</Text>
        </View>
        <View style={styles.statusLabel}>
          <Text style={styles.statusText}>{machineState}</Text>
        </View>
      </View>
      <View style={styles.speedControl}>
        <TouchableOpacity onPress={() => speed(true)}>
          <Image
            style={styles.speedButton}
            source={require('./assets/icons/speed-up.png')}/>
        </TouchableOpacity>
        <Text style={styles.speedText}>Jog speed is {speedValue}</Text>
        <TouchableOpacity onPress={() => speed(false)}>
          <Image
            style={styles.speedButton}
            source={require('./assets/icons/slow-down.png')}/>
        </TouchableOpacity>
      </View>
      <ImageBackground
        source={require('./assets/images/machine.png')}
        style={styles.backgroundImage}
        imageStyle={styles.backgroundImageStyle}
      >
        <View style={styles.workArea}>
          {selectedButton === 'X' && (
            <View style={styles.sideBySideButtons}>
                <TouchableOpacity
                     onPressIn={() => jog('X', -speedValue)}
                     onPressOut={() => jog('X',0)}
                    >
                    <Image style={styles.horizontalArrow} source={require('./assets/icons/left.png')}/>
                </TouchableOpacity>
                <TouchableOpacity
                     onPressIn={() => jog('X', speedValue )}
                     onPressOut={() => jog('X',0)}
                     >
                    <Image style={styles.horizontalArrow} source={require('./assets/icons/right.png')}/>
                </TouchableOpacity>
            </View>
          )}
          {selectedButton === 'Y' && (
            <View style={styles.verticalButtons}>
                <TouchableOpacity
                     onPressIn={() => jog('Y', speedValue)}
                     onPressOut={() => jog('Y',0)}
                    >
                    <Image style={styles.verticalArrow} source={require('./assets/icons/up.png')}/>
                </TouchableOpacity>
                <TouchableOpacity
                     onPressIn={() => jog('Y', -speedValue )}
                     onPressOut={() => jog('Y',0)}
                     >
                    <Image style={styles.verticalArrow} source={require('./assets/icons/down.png')}/>
                </TouchableOpacity>
            </View>
          )}
          {selectedButton === 'Z' && (
            <View style={styles.verticalButtons}>
                <TouchableOpacity
                     onPressIn={() => jog('Z', speedValue )}
                     onPressOut={() => jog('Z',0)}
                    >
                    <Image style={styles.verticalArrow} source={require('./assets/icons/up.png')}/>
                </TouchableOpacity>
                <TouchableOpacity
                     onPressIn={() => jog('Z',-speedValue)}
                     onPressOut={() => jog('Z',0)}
                     >
                    <Image style={styles.verticalArrow} source={require('./assets/icons/down.png')}/>
                </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
      {/*Bottom*/}
      <View style={styles.radioButtonContainer}>
        <View style={styles.radioButton}>
            <RadioButton
                value="X"
                status={selectedButton === 'X' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedButton('X')}
            />
            <Text style={styles.radioButtonLabel}>X</Text>
        </View>
        <View style={styles.radioButton}>
            <RadioButton
                value="Y"
                status={selectedButton === 'Y' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedButton('Y')}
            />
            <Text style={styles.radioButtonLabel}>Y</Text>
        </View>
        <View style={styles.radioButton}>
            <RadioButton
                value="Z"
                status={selectedButton === 'Z' ? 'checked' : 'unchecked'}
                onPress={() => setSelectedButton('Z')}
            />
            <Text style={styles.radioButtonLabel}>Z</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 0,
    width: '100%',
    marginTop: 50,
  },
  connectButton: {
    backgroundColor: '#007bff',
    padding: 10,
    height: 60,
    width: 150,
  },
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  ipInput: {
    flex: 1,
    height: 60,
    fontSize: 30,
    width: '60%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 8,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  statusLabel: {
    flex: 1, // Allow labels to take equal width
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    backgroundColor: 'lightgray',
  },
  statusText: {
    fontSize: 30,
    color: '#333',
    padding: 10,
  },
  speedControl: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: '100%',
    backgroundColor: 'white',
    marginTop: 5,
  },
  speedButton: {
    height: 80,
    width: 80,
    backgroundColor: '#007bff',
    borderRadius: 4,
    padding: 5,
  },
  speedText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 30,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    width: '100%',
    resizeMode: 'cover',
    opacity: 0.5,
  },
  workArea: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  sideBySideButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  verticalButtons: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '60%',
  },
  horizontalArrow: {
    height: 200,
    width: 125,
    tintColor: 'blue',
    marginHorizontal: 10,
  },
  verticalArrow: {
    height: 125,
    width: 200,
    tintColor: 'blue',
    marginVertical: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'lightgray',
    marginTop: 5,
    marginBottom: 50,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButtonLabel: {
    fontSize: 50,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default Layout;
