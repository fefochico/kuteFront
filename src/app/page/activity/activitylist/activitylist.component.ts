import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Activity } from 'src/app/shared/model/activity';
import { ActivityService } from 'src/app/shared/service/activity.service';
import { ShopService } from 'src/app/shared/service/shop.service';
declare var $: any;

@Component({
  selector: 'app-activitylist',
  templateUrl: './activitylist.component.html',
  styleUrls: ['./activitylist.component.css']
})
export class ActivitylistComponent implements OnInit {
  public activities: Activity[] | null= null;
  @Input() set activity(value: Activity[]) {
    this.activities = value;
    this.visible = true;
  }
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  public visible: Boolean | null = null;
  public registerToEdit: Activity | null = null;
  public registerToRemove: Activity | null = null;
  public deleteText = { title: '', info: '' };
  public idDeletePopup = 'deleteActivity';
  constructor(
    private activityService: ActivityService,
    private shopService: ShopService
  ) {}

  ngOnInit() {
    if (!this.activities) this.visible = false;
  }

  edit(activity: Activity | null) {
    this.registerToEdit = activity;
    $('#addActivity').modal('show');
  }

  remove(activity: Activity) {
    this.deleteText = {
      title: `Eliminar actividad`,
      info: `¿Estás seguro de que desea eliminar ${activity.name}?`
    };
    this.registerToRemove = activity;
    $('#' + this.idDeletePopup).modal('show');
  }

  onChangeData(event: any) {
    this.refresh.emit(true);
  }

  onDeleteData(event: any) {
    if (event && this.registerToRemove) {
      let data = { id: this.registerToRemove.id };
      this.activityService.deleteData(data).subscribe((result) => {
        this.refresh.emit(true);
      });
    }
  }
}
