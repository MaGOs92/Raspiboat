import { StreamService } from './../../services/stream.service';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { raspiBoatConfig } from '../../config';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements OnInit {

  @ViewChild('video') videoRef: ElementRef;
  video;
  isStreaming: boolean;
  isStreamPlayed: boolean;

  constructor(private streamService: StreamService) {}

  ngOnInit() {
    this.video = this.videoRef.nativeElement;
    this.streamService.isStreaming.subscribe((isStreaming: boolean) => {
      console.log('STREAM RECEIVED PEERCONNECTION');
      this.isStreaming = isStreaming;
      this.isStreamPlayed = false;
      if (isStreaming) {
        this.setVideoStream();
      }
    });
    this.connect();
  }

  connect() {
    this.streamService.connect();
  }

  setVideoStream() {
    this.video.src = URL.createObjectURL(this.streamService.stream);
    console.log('IN VIDEO STREAM', this.streamService.stream);
  }

  playStream() {
    this.video.play();
    this.isStreamPlayed = true;
  }
}
