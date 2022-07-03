import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivityService } from 'src/app/shared/service/activity.service';
import { UserService } from 'src/app/shared/service/user.service';
import { ShopService } from 'src/app/shared/service/shop.service';
import { Duration } from 'src/app/shared/model/duration';
declare var $: any;

@Component({
  selector: 'app-serviceform',
  templateUrl: './serviceform.component.html',
  styleUrls: ['./serviceform.component.css']
})
export class ServiceformComponent implements OnInit {
  public element: any = null;
  public durations: Duration[] | null=null;
  private idShop: Number | null= null;
  @Input() set data(value: any) {
    this.element = value;
    this.visible = false;
    if (this.element && this.element.name) this.actionTitle = 'Editar';
    else this.actionTitle = 'Añadir';
    this.idShop = this.shopService&&this.shopService.shops?this.shopService.shops[0].id:null;
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

  constructor(
    private activityService: ActivityService,
    private userService: UserService,
    private shopService: ShopService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.activityService.getDurationData().subscribe((result) => {
      this.durations = result;
      this.initForm();
    });
  }

  initForm() {
    this.dataForm = this.fb.group({
      key: [this.isEdit() ? this.element.key : ''],
      name: [this.isEdit() ? this.element.name : '', Validators.required],
      description: [
        this.isEdit() ? this.element.description : '',
        Validators.required
      ],
      idduration: [
        this.isEdit() ? this.element.idduration : null,
        Validators.required
      ],
      idshop: [this.idShop],
      keyactivity: [this.element.keyactivity],
      id: [this.isEdit() ? this.element.id : null]
    });
    this.visible = true;
  }

  isEdit() {
    if (this.element != null) {
      if (this.element.id != null) {
        return true;
      }
    }
    return false;
  }

  saveInfoService() {
    if (this.dataForm && this.dataForm.valid && !this.saving) {
      this.saving = true;
      let data = JSON.stringify(this.dataForm.value);
      this.activityService.postServiceData(data).subscribe(
        (result) => {
          this.error = '';
          $('#addService').modal('hide');
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
}
