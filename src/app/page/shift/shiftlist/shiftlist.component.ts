import { Component, OnInit } from '@angular/core';
import { Shift } from '../../../shared/model/shift';
import { ShiftService } from '../../../shared/service/shift.service';
import { ShopService } from '../../../shared/service/shop.service';
declare var $: any;

@Component({
  selector: 'app-shiftlist',
  templateUrl: './shiftlist.component.html',
  styleUrls: ['./shiftlist.component.css']
})
export class ShiftlistComponent implements OnInit {
  public shifts: Shift[] | null= null;
  public visible = false;
  public registerToEdit: Shift | null= null;
  public registerToRemove: Shift | null = null;
  public deleteText = { title: '', info: '' };
  public idDeletePopup = 'deleteShift';
  constructor(
    private shopService: ShopService,
    private shiftService: ShiftService
  ) {}

  ngOnInit(): void {
    this.shifts = this.shiftService.shifts;
    if (!this.shifts) {
      this.getShifts();
    }
  }

  getShifts() {
    if(this.shopService.shops && this.shopService.shops.length>0){
    this.shiftService
      .getData(this.shopService.shops[0].id)
      .subscribe((result) => {
        this.shifts = result;
        this.visible = true;
      });
    }
  }

  edit(shift: Shift |null) {
    let aux: any = shift;
    this.registerToEdit = aux;
    $('#addShift').modal('show');
  }

  remove(shift: Shift) {
    this.deleteText = {
      title: `Eliminar turno`,
      info: `¿Estás seguro de que desea eliminar ${shift.name}?`
    };
    this.registerToRemove = shift;
    $('#' + this.idDeletePopup).modal('show');
  }

  onChangeData(event: any) {
    this.getShifts();
  }

  onDeleteData(event: any) {
    if (event && this.registerToRemove && this.registerToRemove.id) {
      let data = { id: this.registerToRemove.id };
      this.shiftService.deleteData(data).subscribe((result) => {
        this.getShifts();
      });
    }
  }
}
