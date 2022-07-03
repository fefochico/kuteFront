import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { ActivityRoutingModule } from './activity-routing.module';
import { ServiceformComponent } from './servicelist/serviceform/serviceform.component';
import { ActivityformComponent } from './activitylist/activityform/activityform.component';
import { ActivitylistComponent } from './activitylist/activitylist.component';
import { ServicelistComponent } from './servicelist/servicelist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ActivityComponent,
    ServiceformComponent,
    ActivityformComponent,
    ActivitylistComponent,
    ServicelistComponent
  ],
  imports: [
    CommonModule,
    ActivityRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    ActivityComponent,
    ActivityComponent,
    ServiceformComponent,
    ActivitylistComponent,
    ServicelistComponent
  ]
})
export class ActivityModule {}
