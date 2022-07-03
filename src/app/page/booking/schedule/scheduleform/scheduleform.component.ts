import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Availability } from '../../../../shared/model/availability';
import { BookingService } from '../../../../shared/service/booking.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../shared/service/user.service';
import { ShopService } from '../../../../shared/service/shop.service';

@Component({
  selector: 'app-scheduleform',
  templateUrl: './scheduleform.component.html',
  styleUrls: ['./scheduleform.component.css']
})
export class ScheduleformComponent implements OnInit {
  @Input() filtersValues: any;
  @Input() book: any;
  public selectedAvailability: Availability | null = null;
  @Input() set availability(value: Availability) {
    this.selectedAvailability = value;
    this.initForm();
  }
  @Input() showModal: boolean = true;
  private idShop: Number | null= null;
  @Output() evtClose = new EventEmitter<boolean>();
  public dataForm: FormGroup | null= null;
  public visible: boolean = false;

  constructor(
    private shopService: ShopService,
    private bookingService: BookingService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if(this.shopService.shops && this.shopService.shops.length>0)
    this.idShop = this.shopService.shops[0].id;
  }

  initForm() {
    console.log(this.selectedAvailability);
    this.dataForm = this.fb.group({
      iduser: [this.userService.getIdUser()],
      idshop: [this.idShop],
      idactivity: [
        this.selectedAvailability && this.selectedAvailability.idactivity
          ? this.selectedAvailability.idactivity
          : null
      ],
      idservice: [
        this.selectedAvailability && this.selectedAvailability.idservice
          ? this.selectedAvailability.idservice
          : null
      ],
      keystaff: [
        this.selectedAvailability && this.selectedAvailability.keystaff
          ? this.selectedAvailability.keystaff
          : null
      ],
      idtime: [
        this.selectedAvailability && this.selectedAvailability.idtime
          ? this.selectedAvailability.idtime
          : null
      ],
      idduration: [
        this.selectedAvailability && this.selectedAvailability.idduration
          ? this.selectedAvailability.idduration
          : null
      ],
      client: [
        this.selectedAvailability && this.selectedAvailability.client
          ? this.selectedAvailability.client
          : '',
        Validators.required
      ],
      observation: [
        this.selectedAvailability && this.selectedAvailability.observation
          ? this.selectedAvailability.observation
          : ''
      ],
      date: [
        this.selectedAvailability && this.selectedAvailability.date
          ? this.selectedAvailability.date
          : null
      ]
    });
    this.visible = true;
  }

  close(value: boolean) {
    this.evtClose.emit(value);
  }

  getName(value: string) {
    switch (value) {
      case 'service': {
        if (this.selectedAvailability && this.selectedAvailability.id != -1)
          return this.selectedAvailability.service;
        return this.filtersValues.service;
      }
      case 'personal': {
        if (this.selectedAvailability && this.selectedAvailability.id != -1)
          return this.selectedAvailability.keystaff;
        return this.filtersValues.personal;
      }
      default: {
        return '';
      }
    }
  }

  removeBooking(id: number) {
    const data = { id: id };
    this.bookingService.deleteData(data).subscribe((result) => {
      this.close(true);
    });
  }

  addBooking() {
    if(this.dataForm){
      let data = JSON.stringify(this.dataForm.value);
      this.bookingService.postData(data).subscribe((result) => {
        this.close(true);
      });
    }
  }
}
