import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { DbService } from 'src/app/services/db.service';
import { DatePipe } from '@angular/common';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {

  running: boolean = false;
  startTime!: Date;
  elapsedTime: number = 0;
  displayTime: any = '00:00:00';
  intervalId: any;
  @Input() start_Time: any;

  constructor(public db: DbService, private modalCtrl: ModalController, private route: ActivatedRoute, public fb: FormBuilder, private datepipe: DatePipe, public modal: ModalController, private load: LoadingController, public router: Router) {
  }

  ngOnInit() {
    if (this.start_Time) {
      this.startTime = new Date(this.start_Time);
      this.running = true;
      this.intervalId = this.updateTime();
    }
  }

  close_modal() {
    this.modal.dismiss()
  }

  startStopwatch() {
    if (!this.running) {
      this.startTime = new Date();
      this.modal.dismiss({ data: this.startTime });
      this.running = true;
      this.intervalId = this.updateTime(); // Store the interval ID
    } else {
      this.stopStopwatch(); // Stop the stopwatch when the user clicks "Complete"
    }
  }

  stopStopwatch() {
    this.running = false;
    clearInterval(this.intervalId); // Clear the interval when the user clicks "Complete"
    this.startTime = new Date();
    this.modal.dismiss({ data: this.startTime });
  }

  updateTime() {
    return setInterval(() => {
      if (this.running) {
        const currentTime = new Date().getTime();
        this.elapsedTime = currentTime - this.startTime.getTime();
        this.displayTime = this.formatTime(this.elapsedTime);
      }
    }, 10);
  }

  formatTime(time: number) {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / (1000 * 60)) % 60);
    const hours = Math.floor((time / (1000 * 60 * 60)) % 12);

    return (
      this.padNumber(hours, 2) +
      ':' +
      this.padNumber(minutes, 2) +
      ':' +
      this.padNumber(seconds, 2)
    );
  }

  padNumber(number: number, size: number): string {
    let paddedNumber = number.toString();
    while (paddedNumber.length < size) {
      paddedNumber = '0' + paddedNumber;
    }
    return paddedNumber;
  }

  ionViewWillLeave() {
    this.stopStopwatch();
  }
}
