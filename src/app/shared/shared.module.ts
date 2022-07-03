import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletePopupComponent } from './module/delete-popup/delete-popup.component';

@NgModule({
  declarations: [DeletePopupComponent],
  imports: [CommonModule],
  exports: [DeletePopupComponent]
})
export class SharedModule {}
