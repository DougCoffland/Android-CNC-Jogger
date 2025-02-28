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

import React, { useState, useRef } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';

import Buildbotics from './buildbotics.ts';
import Layout from './_layout';  // Assuming Layout is in _layout.tsx

const App = () => {
  const [hostName, setHostName] = useState<string>('...');
  const [machineState, setMachineState] = useState<string>('...');
  const BB = useRef<Buildbotics | null>(null);

  const updateMessage = (msg: string) => {
    setMachineState(msg);
  };

  const getHostName = () => {
    if (BB.current) {BB.current.get('hostname',showHostName);}
  };

  const showHostName = (name: string) => {
    if (name === null) {
      setHostName('...');
      setMachineState('...');
    } else {
      setHostName(name);
    }
  };

  const jog = (axis: string, speed: number) => {
    if(BB.current) {
        const o: { ts: number, [key: string]: any } = {'ts': Date.now()};
        o[axis] = speed;
        BB.current.put('jog', JSON.stringify(o));
      }
  };

  const handleConnect = (ipAddress: string) => {
    console.log('connect');
    BB.current = new Buildbotics(ipAddress, updateMessage);
    getHostName();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <Layout
          onConnect={handleConnect}
          hostName={hostName}
          machineState={machineState}
          jog={jog}
        />
      </SafeAreaView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
