import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopRoutingModule } from './shop-routing.module';
import { InfoshopformComponent } from './infoshopform/infoshopform.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ShopComponent,
    InfoshopformComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    ReactiveFormsModule
  ],
  exports: [
    ShopComponent,
    InfoshopformComponent,
  ]
})
export class ShopModule {}
