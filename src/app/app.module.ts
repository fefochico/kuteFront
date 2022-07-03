import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarModule } from './navbar/navbar.module';
import { SidebarModule } from './sidebar/sidebar.module';
import { AuthGuard } from './shared/guard/auth.guard';
import { UserService } from './shared/service/user.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ShopService } from './shared/service/shop.service';
import { ActivityService } from './shared/service/activity.service';
import { BookingService } from './shared/service/booking.service';
import { AuthInterceptor } from './request.interceptor.service';

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    NavbarModule,
    SidebarModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    UserService,
    ShopService,
    ActivityService,
    BookingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
