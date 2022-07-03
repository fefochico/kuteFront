import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../shared/service/user.service';
import { ShopService } from '../shared/service/shop.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public visible: Boolean = false;
  constructor(
    private shopService: ShopService,
    private userService: UserService
  ) {
    this.shopService
      .getData(this.userService.getIdUser())
      .subscribe((shops) => {
        if (shops) this.visible = true;
      });
  }

  ngOnInit(): void {}
}
