import { Component, OnInit } from '@angular/core';
import { Activity } from 'src/app/shared/model/activity';
import { ActivityService } from 'src/app/shared/service/activity.service';
import { ShopService } from 'src/app/shared/service/shop.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['../page.css']
})
export class ActivityComponent implements OnInit {
  public list: Activity[] | null =null;
  constructor(
    private activityService: ActivityService,
    private shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.list = this.activityService.activities;
    if (!this.list) this.getActivities();
  }

  private getActivities() {
    if(this.shopService.shops && this.shopService.shops.length>0){
      this.activityService
        .getData(this.shopService.shops[0].id)
        .subscribe((info) => {
          this.list = info;
        });
    }
  }

  onChangeData(event: any) {
    if (event) this.getActivities();
  }
}
