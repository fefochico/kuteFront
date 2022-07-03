import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ShiftService } from 'src/app/shared/service/shift.service';
import { UserService } from 'src/app/shared/service/user.service';
import { ShopService } from 'src/app/shared/service/shop.service';
import { StaffService } from 'src/app/shared/service/staff.service';
import { Shift } from 'src/app/shared/model/shift';
import { Activity } from 'src/app/shared/model/activity';
import { ActivityService } from 'src/app/shared/service/activity.service';
import { Selected } from 'src/app/shared/model/selected';
declare let $: any;

@Component({
  selector: 'app-staffform',
  templateUrl: './staffform.component.html',
  styleUrls: ['./staffform.component.css']
})
export class StaffformComponent implements OnInit {
  public element : any | null= null;
  private idShop: number | null= null; 
  @Input() set data(value: any) {
    this.element = value;
    this.visible = false;
    if (this.element) {
      this.actionTitle = 'Editar';
      this.selectedshift = this.getFormatedShift();
      this.selectedactivity = this.getFormatedActivity();
    } else this.actionTitle = 'Añadir';
    if(this.shopService.shops && this.shopService.shops.length>0){
      this.idShop = this.shopService.shops[0].id;
      const idUser= this.userService.getIdUser();
      if (!this.idShop && idUser) {
        this.userService.getIdUser()
        this.shopService
          .getData(idUser)
          .subscribe((result) => {
            this.idShop = result[0].id;
            if (this.idShop) this.initForm();
          });
      } else {
        this.initForm();
      }
    }
  }
  @Output() saved: EventEmitter<any> = new EventEmitter();
  public dataForm!: FormGroup;
  public visible = false;
  public saving = false;
  public error = '';
  public actionTitle = 'Añadir';
  public dropdownSettings;
  public selectedshift: Selected[] = [];
  public shifts: Shift[]= [];
  public selectedactivity: Selected[]=[];
  public activities: Activity[]= [];

  constructor(
    private staffService: StaffService,
    private activityService: ActivityService,
    private shiftService: ShiftService,
    private userService: UserService,
    private shopService: ShopService,
    private fb: FormBuilder
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'key',
      textField: 'name',
      selectAllText: 'Seleccionar todo',
      unSelectAllText: 'Deseleccionar todo',
      itemsShowLimit: 5,
      allowSearchFilter: false
    };
  }

  getShift() {
    if(this.idShop){
      this.shiftService.getData(this.idShop).subscribe((result) => {
        this.shifts = result;
      });
    }
  }

  getActivity() {
    if(this.idShop){
      this.activityService.getData(this.idShop).subscribe((result) => {
        this.activities = result;
      });
    }
  }

  ngOnInit() {
    if (!this.activities && this.activityService.activities) {
      this.activities = this.activityService.activities;
      this.getActivity();
    }
    if (!this.shifts && this.shiftService.shifts) {
      this.shifts = this.shiftService.shifts;
      this.getShift();
    }
    this.initForm();
  }

  initForm() {
    this.selectedshift = this.getFormatedShift();
    this.selectedactivity = this.getFormatedActivity();
    this.dataForm = this.fb.group({
      key: [this.isEdit() ? this.element.key : ''],
      name: [this.isEdit() ? this.element.name : '', Validators.required],
      surname: [
        this.isEdit() ? this.element.surname : null,
        Validators.required
      ],
      email: [this.isEdit() ? this.element.email : null, Validators.required],
      phone: [this.isEdit() ? this.element.phone : null, Validators.required],
      idshop: [this.idShop],
      id: [this.isEdit() ? this.element.id : null]
    });
    this.visible = true;
  }

  getFormatedShift() {
    const shiftObjects = [];
    if (this.isEdit()) {
      const keys = this.element.keyshifts.split(',');
      const names = this.element.shifts.split(', ');
      for (let i = 0; i < keys.length; i++) {
        shiftObjects.push({ key: keys[i], name: names[i] });
      }
    }
    return shiftObjects;
  }

  getFormatedActivity() {
    const activityObjects = [];
    if (this.isEdit()) {
      const keys = this.element.keyactivities.split(',');
      const names = this.element.activities.split(', ');
      for (let i = 0; i < keys.length; i++) {
        activityObjects.push({ key: keys[i], name: names[i] });
      }
    }
    return activityObjects;
  }

  isEdit() {
    if (this.element != null) {
      if (this.element.id != null) {
        return true;
      }
    }
    return false;
  }

  saveInfoStaff() {
    if (this.dataForm && this.dataForm.valid && !this.saving) {
      this.saving = true;
      let keyshifts = '';
      let shifts = '';
      for (const shift of this.selectedshift) {
        if (keyshifts == '') {
          keyshifts = '' + shift.key;
          shifts = '' + shift.name;
        } else {
          keyshifts += `,${shift.key}`;
          shifts += `, ${shift.name}`;
        }
      }
      if(this.dataForm && this.dataForm.value){

        this.dataForm.addControl('keyshifts', new FormControl(keyshifts));
        this.dataForm.addControl('shifts', new FormControl(shifts));
        let keyactivities : string | null = '';
        let activities = '';
        for (const activity of this.selectedactivity) {
          if(activity){
            if (keyactivities == '' && activity) {
              keyactivities = '' + activity.key?activity.key:null;
              activities = '' + activity.name;
            } else {
              keyactivities += `,${activity.key}`;
              activities += `, ${activity.name}`;
            }
          }
        }
        this.dataForm.addControl('keyactivities', new FormControl(keyactivities));
        this.dataForm.addControl('activities', new FormControl(activities));
        const data = JSON.stringify(this.dataForm.value);
        this.staffService.postData(data).subscribe(
          (result) => {
            this.error = '';
            $('#addStaff').modal('hide');
            this.saved.emit(true);
            this.visible = false;
            this.saving = false;
          },
          (error) => {
            this.saving = false;
            this.error = 'Ha ocurrido un error';
          }
        );
      }
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
