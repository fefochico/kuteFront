import { Component, OnInit } from '@angular/core';
import { Shop } from 'src/app/shared/model/shop';
import { UserService } from 'src/app/shared/service/user.service';
import { Country } from 'src/app/shared/model/country';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShopService } from 'src/app/shared/service/shop.service';

@Component({
  selector: 'form-infoshopform',
  templateUrl: './infoshopform.component.html',
  styleUrls: ['./infoshopform.component.css']
})
export class InfoshopformComponent implements OnInit {
  private infoShop: Shop[] | null= null;
  public country: Country[] | null =null;
  public dataForm: FormGroup | null=null;
  public visible = false;
  public index = 0;
  public saving = false;
  public error: string = '';
  constructor(
    private shopService: ShopService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
  }
  ngOnInit() {
    this.visible = false;
    this.getCoutries();
    this.getInfoShops();
  }

  initForm() {
    this.dataForm = this.fb.group({
      iduser: [this.userService.getIdUser()],
      name: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].name : '',
        Validators.required
      ],
      description: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].description : '',
        Validators.required
      ],
      phone1: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].phone1 : '',
        Validators.required
      ],
      phone2: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].phone2 : ''
      ],
      idcountry: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].idcountry : null,
        Validators.required
      ],
      city: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].city : '',
        Validators.required
      ],
      address: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].address : '',
        Validators.required
      ],
      email: [
        this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].email : '',
        Validators.required
      ],
      id: [this.infoShop && this.infoShop.length > 0 ? this.infoShop[this.index].id : null]
    });
    this.visible = true;
  }

  private getCoutries() {
    this.country = this.shopService.countries;
    if (!this.country) {
      this.shopService.getCountryData().subscribe((countries) => {
        this.country = countries;
      });
    }
  }

  private getInfoShops() {
    this.infoShop = this.shopService.shops;
    this.initForm();
  }

  private refreshInfoShops() {
    if(this.userService.getIdUser()){
    this.shopService
      .getData(this.userService.getIdUser())
      .subscribe((shops) => {
        this.infoShop = shops;
        this.initForm();
      });
    }
  }

  saveInfoShop() {
    if (this.dataForm && this.dataForm.valid && !this.saving) {
      this.saving = true;
      let data = JSON.stringify(this.dataForm.value);
      this.shopService.postData(data).subscribe(
        (result) => {
          this.error = '';
          this.refreshInfoShops();
          this.saving = false;
        },
        (error) => {
          this.saving = false;
          this.error = 'Ha ocurrido un error';
        }
      );
    }
  }
}
