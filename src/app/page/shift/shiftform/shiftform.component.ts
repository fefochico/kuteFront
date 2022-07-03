import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { UserService } from '../../../shared/service/user.service';
import { ShopService } from '../../../shared/service/shop.service';
import { ShiftService } from '../../../shared/service/shift.service';
import { Time } from '../../../shared/model/time';
import { DayStr } from '../../../shared/model/day';
declare var $: any;

@Component({
  selector: 'app-shiftform',
  templateUrl: './shiftform.component.html',
  styleUrls: ['./shiftform.component.css']
})
export class ShiftformComponent implements OnInit {
  public element :any | null= null;
  private idShop: Number | null= null;
  @Input() set data(value: any) {
    this.element = value;
    this.visible = false;
    if (this.element) {
      this.actionTitle = 'Editar';
      this.selecteddays = this.getFormatedDays();
    } else this.actionTitle = 'Añadir';
    this.idShop=null;
    if(this.shopService.shops && this.shopService.shops.length>0)this.idShop = this.shopService.shops[0].id;
    if (!this.idShop) {
      this.shopService
        .getData(this.userService.getIdUser())
        .subscribe((result) => {
          this.idShop = result[0].id;
          if (this.idShop) this.initForm();
        });
    } else {
      this.initForm();
    }
  }
  @Output() saved: EventEmitter<any> = new EventEmitter();
  public dataForm: FormGroup | null= null;
  public visible = false;
  public saving = false;
  public error: String = '';
  public actionTitle: String = 'Añadir';
  public times: Time[] | null= null;
  public days: DayStr[] | null= null;
  public dropdownSettings;
  public selecteddays: any = [];

  constructor(
    private shiftService: ShiftService,
    private userService: UserService,
    private shopService: ShopService,
    private fb: FormBuilder
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: false
    };
  }

  getDays() {
    this.shiftService.getDayData().subscribe((result) => {
      this.days = result;
    });
  }

  getTimes() {
    this.shiftService.getTimeData().subscribe((result) => {
      this.times = result;
    });
  }

  ngOnInit() {
    this.days = this.shiftService.days;
    if (!this.days) {
      this.getDays();
    }
    this.times = this.shiftService.times;
    if (!this.times) {
      this.getTimes();
    }
    this.initForm();
  }

  initForm() {
    this.selecteddays = this.getFormatedDays();
    this.dataForm = this.fb.group({
      key: [this.isEdit()&&this.element ? this.element.key : ''],
      name: [this.isEdit() ? this.element.name : '', Validators.required],
      idstarttime: [
        this.isEdit() ? this.element.idstarttime : null,
        Validators.required
      ],
      idendtime: [
        this.isEdit() ? this.element.idendtime : null,
        Validators.required
      ],
      idshop: [this.idShop],
      id: [this.isEdit() ? this.element.id : null]
    });
    this.visible = true;
  }

  getFormatedDays() {
    let dayObjects = [];
    if (this.isEdit()) {
      let ids = this.element.iddays.split(',');
      let names = this.element.days.split(', ');
      for (let i = 0; i < ids.length; i++) {
        dayObjects.push({ id: Number(ids[i]), name: names[i] });
      }
    }
    return dayObjects;
  }

  isEdit() {
    if (this.element != null) {
      if (this.element.id != null) {
        return true;
      }
    }
    return false;
  }

  saveInfoShift() {
    if (this.dataForm && this.dataForm.valid && !this.saving) {
      this.saving = true;
      let iddays = '';
      let days = '';
      for (let day of this.selecteddays) {
        if (iddays == '') {
          iddays = '' + day.id;
          days = '' + day.name;
        } else {
          iddays += `,${day.id}`;
          days += `, ${day.name}`;
        }
      }
      this.dataForm.addControl('iddays', new FormControl(iddays));
      this.dataForm.addControl('days', new FormControl(days));
      let data = JSON.stringify(this.dataForm.value);
      this.shiftService.postData(data).subscribe(
        (result) => {
          this.error = '';
          $('#addShift').modal('hide');
          this.saved.emit(true);
          this.initForm();
          this.saving = false;
        },
        (error) => {
          this.saving = false;
          this.error = 'Ha ocurrido un error';
        }
      );
    }
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
