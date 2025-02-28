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

export default class Buildbotics {
    private address: string;
    private sock: WebSocket | null;
    private callback: (arg: any) => void;
    private state: any;

    constructor(address: string, callback: (arg: any) => void) {
      this.callback = callback;
      this.address = address;
      console.log('connecting to ' + 'ws://' + this.address + '/websocket');
      this.sock = new WebSocket('ws://' + this.address + '/websocket');
      this.sock.onopen = () => {
        console.log('opened');
      };
      this.sock.onerror = (e) => {
        console.log(e.message);
      };
      this.sock.onclose = () => {
        console.log('close');
        this.address = '';
        this.sock = null;
      };
      this.sock.onmessage = (event) => {
        let msg = JSON.parse(event.data);
          if (this.state === undefined) {this.state = msg; }
          this.update_state(this.state,msg);
        };
      }

    send() {
      if (this.sock) {this.sock.send('$0homed=0');}
    }

    is_object = (o: any) => {return o !== null && typeof o === 'object';};

    update_state = (state: any, update: any) => {
      for (const [key, value] of Object.entries(update)) {
        if (this.is_object(value) && this.is_object(this.state[key])) {
          this.update_state(state[key], value);
        } else {
          state[key] = value;
          if (key === 'xx') {this.callback(value);}
        }
      }
    };

    async get(path: string, callback: (arg: any) => void) {
      if (this.address !== '') {
        try {
          const response = await fetch('http://' + this.address + '/api/' + path);
          console.log(response);
          if (response.ok) {
            const data = await response.json();
            console.log('got response', data);
            callback(data);
          }
        } catch (e) {
          callback(null);
          console.log('error:', e);
        }
      } else {
        callback(null);
      }
    }

    async put(path: string, body: any = {}) {
      if (this.address !== '') {
        try {
          const response = await fetch('http://' + this.address + '/api/' + path, {
                                        method: 'PUT',
                                        body: body,
                                        headers: {
                                        'Content-Type' : 'application/json',
                                        },
                                      });
          if (response.ok) {
            return;
          }
        } catch (e) {
          console.log('error:', e);
        }
      }
    }
}

