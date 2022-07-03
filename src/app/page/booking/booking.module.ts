import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleformComponent } from './schedule/scheduleform/scheduleform.component';

@NgModule({
  declarations: [BookingComponent, ScheduleComponent, ScheduleformComponent],
  imports: [
    CommonModule,
    BookingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMyDatePickerModule
  ],
  exports: [BookingComponent]
})
export class BookingModule {}
