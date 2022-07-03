import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftRoutingModule } from './shift-routing.module';
import { ShiftComponent } from './shift.component';
import { ShiftlistComponent } from './shiftlist/shiftlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShiftformComponent } from './shiftform/shiftform.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [ShiftComponent, ShiftlistComponent, ShiftformComponent],
  imports: [
    CommonModule,
    ShiftRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  exports: [ShiftComponent, ShiftlistComponent]
})
export class ShiftModule {}
