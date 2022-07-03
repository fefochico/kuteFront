import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Availability } from '../../../shared/model/availability';
import { Day } from '../../../shared/class/day';
import { Time } from '../../../shared/model/time';
import { ShiftService } from '../../../shared/service/shift.service';
import { DayStr } from '../../../shared/model/day';
import { Booking } from '../../../shared/model/booking';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  @Input() filtersValues: any;
  @Input() bookings: Availability[][] = [];
  @Input() weekDays: Day[] = [];
  @Input() times: Time[] = [];
  @Output() evtClose = new EventEmitter<boolean>();
  public days: DayStr[]|null=null;
  selectedAvailability: Availability | null = null;
  showModal: boolean = false;

  constructor(private shiftService: ShiftService) {}

  ngOnInit() {
    this.days = this.shiftService.days;
    if (!this.days) {
      this.getDays();
    }
  }

  getDays() {
    this.shiftService.getDayData().subscribe((result) => {
      this.days = result;
    });
  }

  isThisPosition(booking: Booking, weekday: any, idtime: number) {
    if (booking.idtime == idtime) {
      const auxdate = new Date(booking.date);

      if (
        auxdate.getFullYear() === weekday.year &&
        auxdate.getMonth() + 1 === Number(weekday.month) &&
        auxdate.getDate() === Number(weekday.day)
      )
        return true;
    }
    return false;
  }

  editBooking(i:number, j:number) {
    this.selectedAvailability = this.getBookingInRange(i, j);
    if(this.selectedAvailability){
      this.selectedAvailability.idactivity = this.filtersValues.idactivity;
      this.selectedAvailability.idservice = this.filtersValues.idservice;
      this.selectedAvailability.keystaff = this.filtersValues.keystaff;
      this.selectedAvailability.idduration = this.filtersValues.idduration;
      if (this.selectedAvailability.enabled !== 'disabled') {
        if (
          this.filtersValues.idservice ||
          (this.selectedAvailability != null &&
            this.selectedAvailability.id != -1)
        ) {
          this.showModal = true;
        }
      }
    }
  }

  getBookingInRange(i: number, j: number) {
    let choosen = this.bookings[i][j];
    for (let inc = 0; inc < this.filtersValues.idduration; inc++) {
      if (!(this.times.length - 1 < j + inc)) {
        if (this.bookings[i][j + inc].enabled === 'disabled') {
          return this.bookings[i][j + inc];
        }
        if (this.bookings[i][j + inc].id != -1) {
          choosen = this.bookings[i][j + inc];
        }
      }
    }
    return choosen;
  }

  closeModal(value: boolean) {
    this.showModal = false;
    this.selectedAvailability = null;
    if (value) this.evtClose.emit(true);
  }

  onMouseOver(i: number, j: number, isOver: boolean) {
    for (let inc = 0; inc < this.filtersValues.idduration; inc++) {
      if (!(this.times.length - 1 < j + inc)) {
        if (isOver) this.changeClassByOver(i, j, inc, true);
        else this.changeClassByOver(i, j, inc, false);
      } else {
        break;
      }
    }
  }

  changeClassByOver(i: number, j: number, inc: number, isOver: boolean) {
    if (isOver) {
      if (this.bookings[i][j + inc].status.indexOf('busy') != -1) {
        this.bookings[i][j + inc].status =
          this.bookings[i][j + inc].status + ' mouseOver-busy';
      } else {
        this.bookings[i][j + inc].status =
          this.bookings[i][j + inc].status + ' mouseOver-availability';
      }
    } else {
      let n = this.bookings[i][j + inc].status.indexOf(' mouseOver');
      let o = this.bookings[i][j + inc].status.indexOf('busy');
      if (n > o) {
        this.bookings[i][j + inc].status = this.bookings[i][
          j + inc
        ].status.substring(0, n);
      } else {
        if (n+'' != '-1' && o+'' != '-1')
          this.bookings[i][j + inc].status = this.bookings[i][
            j + inc
          ].status.substring(n + 1);
      }
    }
  }

  getDay() {
    for (let i = 0; i < this.weekDays.length; i++) {
      if (this.weekDays[i].selected &&this.days && this.days.length>0) return this.days[i].name;
    }
    return null;
  }
}
