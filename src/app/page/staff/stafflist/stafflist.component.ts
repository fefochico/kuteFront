import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/shared/model/activity';
import { Shift } from 'src/app/shared/model/shift';
import { Staff } from 'src/app/shared/model/staff';
import { ActivityService } from 'src/app/shared/service/activity.service';
import { ShiftService } from 'src/app/shared/service/shift.service';
import { ShopService } from 'src/app/shared/service/shop.service';
import { StaffService } from 'src/app/shared/service/staff.service';
declare let $: any;

@Component({
  selector: 'app-stafflist',
  templateUrl: './stafflist.component.html',
  styleUrls: ['./stafflist.component.css']
})
export class StafflistComponent implements OnInit {
  public staff: Staff[] | null= null;
  public shifts: Shift[] | null = null;
  public activities: Activity[] | null= null;
  private idShop: number | null= null;

  public visible = false;
  public registerToEdit: Staff | null= null;
  public registerToRemove: Staff | null= null;
  public deleteText = { title: '', info: '' };
  public idDeletePopup = 'deleteStaff';
  constructor(
    private shopService: ShopService,
    private staffService: StaffService,
    private shiftService: ShiftService,
    private activityService: ActivityService
  ) {}

  ngOnInit(): void {
    this.staff = this.staffService.staff;
    if(this.shopService.shops && this.shopService.shops.length>0)
      this.idShop = this.shopService.shops[0].id;
    this.getActivity();
  }

  getShift() {
    if(this.idShop){
      this.shiftService.getData(this.idShop).subscribe((result) => {
        this.shifts = result;
        this.getStaff();
      });
    }
  }

  getActivity() {
    if(this.idShop) {
      this.activityService.getData(this.idShop).subscribe((result) => {
        this.activities = result;
        this.getShift();
      });
    }
  }

  getStaff() {
    if(this.shopService.shops && this.shopService.shops.length>0){
      this.staffService
        .getData(this.shopService.shops[0].id)
        .subscribe((result) => {
          this.staff = result;
          for (const s of this.staff) {
            s.activities = this.getActivitiesNames(s.keyactivities);
            s.shifts = this.getShiftsNames(s.keyshifts);
          }
          this.visible = true;
        });
    }
  }

  edit(staff: Staff|null) {
    const aux: any = staff;
    this.registerToEdit = aux;
    $('#addStaff').modal('show');
  }

  remove(staff: Staff) {
    this.deleteText = {
      title: `Eliminar turno`,
      info: `¿Estás seguro de que desea eliminar ${staff.name}?`
    };
    this.registerToRemove = staff;
    $('#' + this.idDeletePopup).modal('show');
  }

  onChangeData(event: any) {
    this.getStaff();
  }

  onDeleteData(event: any) {
    if (event && this.registerToRemove && this.registerToRemove.id) {
      const data = { id: this.registerToRemove.id };
      this.staffService.deleteData(data).subscribe((result) => {
        this.getStaff();
      });
    }
  }

  getActivitiesNames(keys: string) {
    const keysActivities = keys.split(',');
    let result = '';
    for (const key of keysActivities) {
      let activity=null;
      if(this.activities && this.activities.length>0)
        activity= this.activities.find((res) => res.key == key);
      if (activity) {
        if (result != '') result += ', ' + activity.name;
        else result += activity.name;
      }
    }
    return result;
  }

  getShiftsNames(keys: string) {
    const keysShifts = keys.split(',');
    let result = '';
    for (const key of keysShifts) {
      let shift=null
      if(this.shifts && this.shifts.length>0)
        shift = this.shifts.find((res) => res.key == key);
      if (shift) {
        if (result != '') result += ', ' + shift.name;
        else result += shift.name;
      }
    }
    return result;
  }
}
