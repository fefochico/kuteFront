import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Service } from 'src/app/shared/model/service';
import { Activity } from 'src/app/shared/model/activity';
import { ActivityService } from 'src/app/shared/service/activity.service';
import { ShopService } from 'src/app/shared/service/shop.service';
declare var $: any;

@Component({
  selector: 'app-servicelist',
  templateUrl: './servicelist.component.html',
  styleUrls: ['./servicelist.component.css']
})
export class ServicelistComponent implements OnInit {
  public visible: Boolean | null = null;
  public deleteText = { title: '', info: '' };
  public activities: Activity[] | null = null;
  public idDeletePopup = 'deleteService';
  @Input() set activity(value: Activity[]) {
    this.activities = value;
    if (this.activities) this.getServices();
  }
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  public services: Service[] | null = null;
  public registerToEdit: any = { keyactivity: null };
  public registerToRemove: Service | null = null;
  constructor(
    private activityService: ActivityService,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    if (!this.activities) this.visible = false;
    else this.getServices();
  }

  private getServices() {
    if(this.shopService.shops && this.shopService.shops.length>0){
      this.activityService
      .getServiceData(this.shopService.shops[0].id)
      .subscribe((info) => {
        this.services = info;
        this.visible = true;
      });
    }
  }

  edit(activity: Activity, service: Service | null) {
    let aux: any = service;
    if (!aux) aux = { keyactivity: activity.key };
    this.registerToEdit = aux;
    $('#addService').modal('show');
  }

  remove(service: Service) {
    this.deleteText = {
      title: `Eliminar servicio`,
      info: `¿Estás seguro de que desea eliminar ${service.name}?`
    };
    this.registerToRemove = service;
    $('#' + this.idDeletePopup).modal('show');
  }

  onChangeData(event:any) {
    this.getServices();
  }

  onDeleteData(event: any) {
    if (event && this.registerToRemove) {
      let data = { id: this.registerToRemove.id };
      this.activityService.deleteServiceData(data).subscribe((result) => {
        this.refresh.emit(true);
      });
    }
  }
}
