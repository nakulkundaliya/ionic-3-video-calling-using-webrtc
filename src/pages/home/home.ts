import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';

declare var apiRTC: any

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  showCall: boolean;
  showHangup: boolean;
  showAnswer: boolean;
  showReject: boolean;
  showStatus: boolean;
  showRemoteVideo: boolean = true;
  showMyVideo: boolean = true;

  session;
  webRTCClient;
  incomingCallId = 0;
  myCallId;
  status;
  calleeId;

  constructor(public navCtrl: NavController,private nativeAudio: NativeAudio) {
    this.InitializeApiRTC();
    this.nativeAudio.preloadComplex('uniqueI1', 'assets/tone.mp3', 1, 1, 0).then((succ)=>{
      console.log("suu",succ)
    }, (err)=>{
      console.log("err",err)
    });

  }

  InitializeApiRTC() {
    //apiRTC initialization
    apiRTC.init({
      apiKey: "819abef1fde1c833e0601ec6dd4a8226",
      // apiCCId : "2",
      onReady: (e) => {
        this.sessionReadyHandler(e);
      }
    });
  }

  sessionReadyHandler(e) {
    this.myCallId = apiRTC.session.apiCCId;
    this.InitializeControls();
    this.AddEventListeners();
    this.InitializeWebRTCClient();
  }

  InitializeWebRTCClient() {
    this.webRTCClient = apiRTC.session.createWebRTCClient({
      status: "status" //Optionnal
    });
    /*    this.webRTCClient.setAllowMultipleCalls(true);
        this.webRTCClient.setVideoBandwidth(300);
        this.webRTCClient.setUserAcceptOnIncomingCall(true);*/
  }

  InitializeControls() {
    this.showCall = true;
    this.showAnswer = false;
    this.showHangup = false;
    this.showReject = false;
  }

  InitializeControlsForIncomingCall() {
    this.showCall = false;
    this.showAnswer = true;
    this.showReject = true;
    this.showHangup = true;
    this.nativeAudio.loop('uniqueI1').then((succ)=>{
      console.log("succ",succ)
    }, (err)=>{
      console.log("err",err)
    });

  }

  InitializeControlsForHangup() {
    this.showCall = true;
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
  }

  UpdateControlsOnAnswer() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = true;
    this.showCall = false;
  }

  UpdateControlsOnReject() {
    this.showAnswer = false;
    this.showReject = false;
    this.showHangup = false;
    this.showCall = true;
  }

  RemoveMediaElements(callId) {
    this.webRTCClient.removeElementFromDiv('mini', 'miniElt-' + callId);
    this.webRTCClient.removeElementFromDiv('remote', 'remoteElt-' + callId);
  }

  AddStreamInDiv(stream, callType, divId, mediaEltId, style, muted) {
    let mediaElt = null;
    let divElement = null;

    if (callType === 'audio') {
      mediaElt = document.createElement("audio");
    } else {
      mediaElt = document.createElement("video");
    }

    mediaElt.id = mediaEltId;
    mediaElt.autoplay = true;
    mediaElt.muted = muted;
    mediaElt.style.width = style.width;
    mediaElt.style.height = style.height;

    divElement = document.getElementById(divId);
    divElement.appendChild(mediaElt);

    this.webRTCClient.attachMediaStream(mediaElt, stream);
  }

  AddEventListeners() {
    apiRTC.addEventListener("userMediaSuccess", (e) => {
      this.showStatus = true;
      this.showMyVideo = true;

      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "mini", 'miniElt-' + e.detail.callId, {
        width: "128px",
        height: "96px"
      }, true);

    });

    apiRTC.addEventListener("userMediaError", (e) => {
      this.InitializeControlsForHangup();

      this.status = this.status + "<br/> The following error has occurred <br/> " + e;
    });

    apiRTC.addEventListener("incomingCall", (e) => {
      this.InitializeControlsForIncomingCall();
      this.incomingCallId = e.detail.callId;
    });

    apiRTC.addEventListener("hangup", (e) => {
      if (e.detail.lastEstablishedCall === true) {
        this.InitializeControlsForHangup();
      }
      this.status = this.status + "<br/> The call has been hunged up due to the following reasons <br/> " + e.detail.reason;
      this.RemoveMediaElements(e.detail.callId);
    });

    apiRTC.addEventListener("remoteStreamAdded", (e) => {
      this.webRTCClient.addStreamInDiv(e.detail.stream, e.detail.callType, "remote", 'remoteElt-' + e.detail.callId, {
        width: "300px",
        height: "225px"
      }, false);
    });

    apiRTC.addEventListener("webRTCClientCreated", (e) => {
      console.log("webRTC Client Created");
      this.webRTCClient.setAllowMultipleCalls(true);
      this.webRTCClient.setVideoBandwidth(300);
      this.webRTCClient.setUserAcceptOnIncomingCall(true);

      /*      this.InitializeControls();
            this.AddEventListeners();*/

      //this.MakeCall("729278");
    });

  }

  MakeCall(calleeId) {
    var callId = this.webRTCClient.call(calleeId);
    if (callId != null) {
      this.incomingCallId = callId;
      this.showHangup = true;
    }
  }

  HangUp() {
    this.webRTCClient.hangUp(this.incomingCallId);
  }

  AnswerCall(incomingCallId) {
    this.webRTCClient.acceptCall(incomingCallId);
    this.nativeAudio.stop('uniqueI1').then(()=>{},()=>{});

    this.UpdateControlsOnAnswer();
  }

  RejectCall(incomingCallId) {
    this.webRTCClient.refuseCall(incomingCallId);
    this.UpdateControlsOnReject();
    this.RemoveMediaElements(incomingCallId);
  }

}
