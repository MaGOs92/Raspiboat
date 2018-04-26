import { environment } from './../../environments/environment';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { WebsocketService } from '../classes/websocket-service';

@Injectable()
export class StreamService extends WebsocketService {

  isStreaming: EventEmitter<boolean> = new EventEmitter<boolean>();
  peerConnection: RTCPeerConnection;
  config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
  stream: MediaStream;

  constructor() {
    super();
  }

  connect() {
    this.ws = new WebSocket(environment.streamUrl);
    this.ws.onopen = event => this.onOpen(event);
    this.ws.onclose =  event => this.onClose(event);
    this.ws.onmessage = event => this.onMessage(event);
    this.ws.onerror = event => this.onError(event);
  }

  onOpen(event) {
    console.log('Websocket connnected: ' + this.ws.url);
    this.connected = true;
    this.doRegister();
  }

  onClose(event) {
    console.log('Websocket Disconnected');
    this.connected = false;
    this.doDisconnect();
  }

  onError(event) {
    console.log('An error occured while connecting : ' + event.data);
  }

  webSocketSend(message: string) {
    if (this.ws.readyState === WebSocket.OPEN ||
      this.ws.readyState === WebSocket.CONNECTING) {
      this.ws.send(message);
      return true;
    }
    return false;
  }

  randomString(strLength) {
    const result = [];
    strLength = strLength || 5;
    const charSet = '0123456789';
    while (strLength--) {
      result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }
    return result.join('');
  }

  doRegister() {
    // No Room concept, random generate room and client id.
    const register = {
      cmd: 'register',
      roomid: this.randomString(9),
      clientid: this.randomString(8)
    };
    const register_message = JSON.stringify(register);
    this.webSocketSend(register_message);
  }

  doSend(data) {
    const message = {
      cmd: 'send',
      msg: data,
      error: ''
    };
    const data_message = JSON.stringify(message);
    if (this.webSocketSend(data_message) === false) {
      console.log('Failed to send data: ' + data_message);
      return false;
    }
    return true;
  }

  doDisconnect() {
    if (this.ws.readyState === 1) {
      this.ws.close();
    }
  }

  onMessage(event) {
    console.log('WSS -> C: ' + event.data);
    const dataJson = JSON.parse(event.data);
    if (dataJson['cmd'] === 'send') {
      this.doHandlePeerMessage(dataJson['msg']);
    }
  }

  createPeerConnection() {
    try {
      const peerConnection = new RTCPeerConnection(this.config);
      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          const candidate = {
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          };
          this.doSend(JSON.stringify(candidate));
        } else {
          console.log('End of candidates.');
        }
      };
      // Handle event onaddstream in component
      peerConnection.onaddstream = this.onRemoteStreamAdded.bind(this);
      peerConnection.onremovestream = this.onRemoteStreamRemoved.bind(this);
      console.log('Created RTCPeerConnnection with config: ' + JSON.stringify(this.config));
      this.peerConnection = peerConnection;
    } catch (e) {
      console.log('Failed to create PeerConnection exception: ' + e.message);
    }
  }

  doHandlePeerMessage(data) {
    const dataJson = JSON.parse(data);
    console.log('Handle Message :', JSON.stringify(dataJson));

    if (dataJson['type'] === 'offer') {        // Processing offer
      console.log('Offer from PeerConnection');
      const sdp_returned = this.forceChosenVideoCodec(dataJson.sdp, 'H264/90000');
      dataJson.sdp = sdp_returned;
      // Creating PeerConnection
      this.createPeerConnection();
      const description = new RTCSessionDescription(dataJson);
      this.peerConnection.setRemoteDescription(description);
      this.peerConnection.createAnswer().then(sessionDescription => {
        console.log('Create answer:', sessionDescription);
        this.peerConnection.setLocalDescription(sessionDescription);
        const msg = JSON.stringify(sessionDescription);
        console.log('Sending Answer: ' + msg);
        this.doSend(msg);
      }).catch((err) => {
        console.log('Create answer error:', err);
      });
    } else if (dataJson['type'] === 'candidate') {    // Processing candidate
      console.log('Adding ICE candiate ' + dataJson.candidate);
      console.log('Adding mLineIndex ' + dataJson.label);
      const ice_candidate = new RTCIceCandidate({
        sdpMLineIndex: dataJson.label,
        sdpMid: dataJson.id,
        candidate: dataJson.candidate
      });
      this.peerConnection.addIceCandidate(ice_candidate);
    }
  }

  onRemoteStreamAdded(event) {
    console.log('Stream received');
    this.stream = event.stream;
    this.isStreaming.emit(true);
  }

  onRemoteStreamRemoved(event) {
    console.log('Remote stream removed.');
    this.isStreaming.emit(false);
  }

  forceChosenVideoCodec(sdp, codec) {
    return this.maybePreferCodec(sdp, 'video', 'send', codec);
  }

  forceChosenAudioCodec(sdp, codec) {
    return this.maybePreferCodec(sdp, 'audio', 'send', codec);
  }

  // Copied from AppRTC's sdputils.js:

  // Sets |codec| as the default |type| codec if it's present.
  // The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.
  maybePreferCodec(sdp, type, dir, codec) {
    const str = type + ' ' + dir + ' codec';
    if (codec === '') {
      console.log('No preference on ' + str + '.');
      return sdp;
    }

    console.log('Prefer ' + str + ': ' + codec);	// kclyu

    const sdpLines = sdp.split('\r\n');

    // Search for m line.
    const mLineIndex = this.findLine(sdpLines, 'm=', type);
    if (mLineIndex === null) {
      console.log('* not found error: ' + str + ': ' + codec);	// kclyu
      return sdp;
    }

    // If the codec is available, set it as the default in m line.
    const codecIndex = this.findLine(sdpLines, 'a=rtpmap', codec);
    console.log('mLineIndex Line: ' + sdpLines[mLineIndex]);
    console.log('found Prefered Codec in : ' + codecIndex + ': ' + sdpLines[codecIndex]);
    console.log('codecIndex', codecIndex);
    if (codecIndex) {
      const payload = this.getCodecPayloadType(sdpLines[codecIndex]);
      if (payload) {
        sdpLines[mLineIndex] = this.setDefaultCodec(sdpLines[mLineIndex], payload);
        // sdpLines[mLineIndex] = setDefaultCodecAndRemoveOthers(sdpLines, sdpLines[mLineIndex], payload);
      }
    }

    // delete id 100(VP8) and 101(VP8)

    console.log('** Modified LineIndex Line: ' + sdpLines[mLineIndex]);
    sdp = sdpLines.join('\r\n');
    return sdp;
  }

  // Find the line in sdpLines that starts with |prefix|, and, if specified,
  // contains |substr| (case-insensitive search).
  findLine(sdpLines, prefix, substr) {
    return this.findLineInRange(sdpLines, 0, -1, prefix, substr);
  }

  // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
  // and, if specified, contains |substr| (case-insensitive search).
  findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
    const realEndLine = endLine !== -1 ? endLine : sdpLines.length;
    for (let i = startLine; i < realEndLine; ++i) {
      if (sdpLines[i].indexOf(prefix) === 0) {
        if (!substr ||
          sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
          return i;
        }
      }
    }
    return null;
  }

  // Gets the codec payload type from an a=rtpmap:X line.
  getCodecPayloadType(sdpLine) {
    const pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
    const result = sdpLine.match(pattern);
    return (result && result.length === 2) ? result[1] : null;
  }

  // Returns a new m= line with the specified codec as the first one.
  setDefaultCodec(mLine, payload) {
    const elements = mLine.split(' ');

    // Just copy the first three parameters; codec order starts on fourth.
    const newLine = elements.slice(0, 3);

    // Put target payload first and copy in the rest.
    newLine.push(payload);
    for (let i = 3; i < elements.length; i++) {
      if (elements[i] !== payload) {
        newLine.push(elements[i]);
      }
    }
    return newLine.join(' ');
  }


  setDefaultCodecAndRemoveOthers(sdpLines, mLine, payload) {
    const elements = mLine.split(' ');

    // Just copy the first three parameters; codec order starts on fourth.
    const newLine = elements.slice(0, 3);


    // Put target payload first and copy in the rest.
    newLine.push(payload);
    for (let i = 3; i < elements.length; i++) {
      if (elements[i] !== payload) {

        //  continue to remove all matching lines
        for (let line_removed = true; line_removed;) {
          line_removed = this.RemoveLineInRange(sdpLines, 0, -1, 'a=rtpmap', elements[i]);
        }
        //  continue to remove all matching lines
        for (let line_removed = true; line_removed;) {
          line_removed = this.RemoveLineInRange(sdpLines, 0, -1, 'a=rtcp-fb', elements[i]);
        }
      }
    }
    return newLine.join(' ');
  }

  RemoveLineInRange(sdpLines, startLine, endLine, prefix, substr) {
    const realEndLine = endLine !== -1 ? endLine : sdpLines.length;
    for (let i = startLine; i < realEndLine; ++i) {
      if (sdpLines[i].indexOf(prefix) === 0) {
        if (!substr ||
          sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
          const str = 'Deleting(index: ' + i + ') : ' + sdpLines[i];
          console.log(str);
          sdpLines.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }
}
