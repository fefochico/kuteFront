import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { Day } from 'src/app/shared/class/day';
import { Activity } from 'src/app/shared/model/activity';
import { FilterValues } from 'src/app/shared/model/filterValues';
import { Service } from 'src/app/shared/model/service';
import { Shift } from 'src/app/shared/model/shift';
import { Staff } from 'src/app/shared/model/staff';
import { Time } from 'src/app/shared/model/time';
import { ActivityService } from 'src/app/shared/service/activity.service';
import { BookingService } from 'src/app/shared/service/booking.service';
import { ShiftService } from 'src/app/shared/service/shift.service';
import { ShopService } from 'src/app/shared/service/shop.service';
import { StaffService } from 'src/app/shared/service/staff.service';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  idShop: number | null = null;
  idUser: string | null = null;
  activities : Activity[] | null= [];
  times: Time[] | null = [];
  services: Service[] | null = [];
  shifts :Shift[] | null= [];
  personal: Staff[]|null = [];
  bookings: any[] = [];

  weekDays: Day[] = [];

  filtersValues : FilterValues= {
    keyactivity: null,
    idactivity: null,
    keyservice: null,
    idservice: null,
    keystaff: null,
    keyshift: null,
    service: '',
    idduration: null,
    staff: '',
    startDate: '',
    endDate: '',
    shift: ''
  };

  myDpOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
  };

  public model!: IMyDateModel;

  constructor(
    private userService: UserService,
    private bookingService: BookingService,
    private activityService: ActivityService,
    private shiftService: ShiftService,
    private shopService: ShopService,
    private staffService: StaffService
  ) {}

  ngOnInit(): void {
    if(this.shopService.shops && this.shopService.shops.length>0)
      this.idShop = this.shopService.shops[0].id;
      this.idUser = this.userService.getIdUser();
      this.activities = this.activityService.activities;
      if (!this.activities) this.getActivities();
      if (!this.shiftService.times) this.getTimes();
      else this.times = this.shiftService.times;
      setTimeout(() => {
        this.setDefaultValues();
      }, 1000);
  }

  private getActivities() {
    if(this.shopService.shops && this.shopService.shops.length>0){
      this.activityService
      .getData(this.shopService.shops[0].id)
      .subscribe((info) => {
        this.activities = info;
      });
    }
  }

  private getTimes() {
    this.shiftService.getTimeData().subscribe((result) => {
      this.times = result;
    });
  }

  private getServices() {
    if(this.shopService.shops && this.shopService.shops.length>0){
      this.activityService
        .getServiceData(this.shopService.shops[0].id)
        .subscribe((info) => {
          this.services = [];
          for (let s of info) {
            if (s.keyactivity+'' == this.filtersValues.keyactivity)
              this.services.push(s);
          }
          if (this.filtersValues.keyservice) this.selected('keyservice');
        });
    }
  }

  private getPersonal() {
    if(this.shopService.shops && this.shopService.shops.length>0){
      this.staffService
        .getData(this.shopService.shops[0].id)
        .subscribe((info) => {
          this.personal = [];
          for (let p of info) {
            const keyactivities = p.keyactivities.split(',');
            for (let a of keyactivities) {
              if (a == this.filtersValues.keyactivity) {
                this.personal.push(p);
              }
            }
          }
          if (this.filtersValues.keystaff) this.selected('keystaff');
        });
    }
  }

  private setDefaultValues() {
    const lsKutefy=localStorage.getItem('kutefy-bookings');
    if(lsKutefy){
      const values = JSON.parse(lsKutefy);
      if (values) {
        if (values.keyactivity !== null) {
          this.filtersValues.keyactivity = values.keyactivity;
          this.selected('keyactivity');
          if (values.keystaff) this.getPersonal();
          this.filtersValues.keystaff = values.keystaff;
          if (values.keyservice) this.getServices();
          this.filtersValues.keyservice = values.keyservice;
        }
      }
      this.setDefaultDate(values.IMyDate);
    }
  }

  private setDefaultDate(dateSaved: any) {
    if (dateSaved != null) {
      this.model = dateSaved;
      const date = new Date();
      if(this.model && this.model.singleDate && this.model.singleDate.date){
        date.setDate(this.model.singleDate.date.day);
        date.setFullYear(this.model.singleDate.date.year);
        date.setMonth(Number(this.model.singleDate.date.month) - 1);
        this.model.singleDate.jsDate = date;
      }
    } else {
      const date = new Date();
      this.model = {
        isRange: false,
        dateRange: undefined,
        singleDate: {
          date: {
            year: date.getFullYear(),
            day: date.getDate(),
            month: date.getMonth() + 1
          },
          jsDate: date,
          epoc: date.getTime() / 1000
        }
      };
    }
    if (this.model) {
      this.generateWeekDays(this.model);
      this.getBookings();
    }
  }

  selected(value: any) {
    switch (value) {
      case 'keyactivity': {
        if (this.activities) {
          this.getServices();
          this.getPersonal();
          const value = this.activities.find(
            (element) => element.key == this.filtersValues.keyactivity
          );
          this.filtersValues.keystaff = null;
          this.filtersValues.keyservice = null;
          if(value && value && value.id)
            this.filtersValues.idactivity = value.id;
          this.getBookings();
        }
        break;
      }
      case 'keyservice': {
        if (this.services) {
          const value = this.services.find(
            (element) => element.key == this.filtersValues.keyservice
          );
          if(value){
            this.filtersValues.service = value.name;
            this.filtersValues.idservice = value.id;
            this.filtersValues.idduration = value.idduration;
          }
        }
        break;
      }
      case 'keystaff': {
        if (this.personal) {
          const value = this.personal.find(
            (element) => element.key == this.filtersValues.keystaff
          );
          if(value && value.name)
            this.filtersValues.staff = value.name;
          if (this.weekDays.length > 0) this.getBookings();
        }
        break;
      }
      default: {
      }
    }
    this.saveSelection();
  }

  // optional date changed callback
  onDateChanged(event: IMyDateModel): void {
    this.model = event;
    this.saveSelection();

    this.generateWeekDays(this.model);
    this.getBookings();
  }

  generateWeekDays(date: IMyDateModel) {
    this.weekDays = [];
    if (
      date &&
      date.singleDate &&
      date.singleDate.jsDate &&
      date.singleDate.jsDate.getDay() &&
      date.singleDate.jsDate.getDay() != 0
    ) {
      for (let i = 1; i <= 7; i++) {
        if (date.singleDate.jsDate.getDay() == i) {
          this.weekDays.push(
            new Day(
              date.singleDate.date!.day.toString(),
              date.singleDate.date!.month.toString(),
              date.singleDate.date!.year.toString(),
              true
            )
          );
        } else {
          const diff = i - date.singleDate.jsDate.getDay();
          let auxDate = new Date(date.singleDate.jsDate);
          auxDate.setDate(auxDate.getDate() + diff);
          const year = auxDate.getFullYear();
          const month = auxDate.getMonth() + 1;
          const day = auxDate.getDate();
          this.weekDays.push(
            new Day(day.toString(), month.toString(), year.toString(), false)
          );
        }
      }
    } else {
      if(date && date.singleDate && date.singleDate.jsDate){
        for (let i = 1; i < 7; i++) {
          const diff = i - 7;
          let auxDate = new Date(date.singleDate.jsDate);
          auxDate.setDate(auxDate.getDate() + diff);
          const year = auxDate.getFullYear();
          const month = auxDate.getMonth() + 1;
          const day = auxDate.getDate();
          this.weekDays.push(
            new Day(day.toString(), month.toString(), year.toString(), false)
          );
        }
      }
      if(date && date.singleDate && date.singleDate.date){
        this.weekDays.push(
          new Day(
            date.singleDate.date.day.toString(),
            date.singleDate.date.month.toString(),
            date.singleDate.date.year.toString(),
            true
          )
        );
      }
    }
  }

  getBookings() {
    if (this.filtersValues.keystaff && this.shopService.shops && this.shopService.shops.length>0) {
      const startDate = `${this.weekDays[0].year}-${this.weekDays[0].month}-${this.weekDays[0].day}`;
      const endDate = `${this.weekDays[6].year}-${this.weekDays[6].month}-${this.weekDays[6].day}`;
      this.bookingService
        .getDataWithDates(
          this.shopService.shops[0].id,
          this.filtersValues.keystaff,
          startDate,
          endDate
        )
        .subscribe((result) => {
          this.bookings = result;
        });
    }
  }

  saveSelection() {
    localStorage.removeItem('kutefy-bookings');
    localStorage.setItem(
      'kutefy-bookings',
      JSON.stringify({
        keyactivity: this.filtersValues.keyactivity,
        keystaff: this.filtersValues.keystaff,
        keyservice: this.filtersValues.keyservice,
        IMyDate: this.model
      })
    );
  }
}
