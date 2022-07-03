import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './service/login.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}
  public isSubmitted = false;
  public error = false;
  ngOnInit(): void {}

  send() {
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return;
    }
    this.loginService.login(this.userForm.value).subscribe(
      (result) => {
        this.error = false;
        this.router.navigate(['/home/shop']);
      },
      (error) => {
        this.error = true;
      }
    );
  }
}
