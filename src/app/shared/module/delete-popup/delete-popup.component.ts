import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.css']
})
export class DeletePopupComponent implements OnInit {
  @Input() id?: string;
  @Input() text: any;
  @Output() removed: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  deleteInfo() {
    $('#' + this.id).modal('hide');
    this.removed.emit(true);
  }
}
