import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  selectedIndex: number | undefined;

  constructor(private router: Router) {
    let route = this.router.url.split('/');
    let section = route[route.length - 1];
    this.setDefaultIndex(section);
  }

  setDefaultIndex(section: string) {
    switch (section) {
      case 'shop': {
        this.selectedIndex = 1;
        break;
      }
      case 'activity': {
        this.selectedIndex = 2;
        break;
      }
      case 'shift': {
        this.selectedIndex = 3;
        break;
      }
      case 'staff': {
        this.selectedIndex = 4;
        break;
      }
      case 'booking': {
        this.selectedIndex = 5;
        break;
      }
      default: {
        this.selectedIndex = undefined;
      }
    }
  }

  ngOnInit(): void {}

  setIndex(index: number) {
    this.selectedIndex = index;
  }
}
