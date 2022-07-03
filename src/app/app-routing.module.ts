import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'shop', pathMatch: 'full' },
      {
        path: 'shop',
        loadChildren: () =>
          import('./page/shop/shop.module').then((m) => m.ShopModule)
      },
      {
        path: 'activity',
        loadChildren: () =>
          import('./page/activity/activity.module').then(
            (m) => m.ActivityModule
          )
      },
      {
        path: 'shift',
        loadChildren: () =>
          import('./page/shift/shift.module').then((m) => m.ShiftModule)
      },
      {
        path: 'staff',
        loadChildren: () =>
          import('./page/staff/staff.module').then((m) => m.StaffModule)
      },
      {
        path: 'booking',
        loadChildren: () =>
          import('./page/booking/booking.module').then((m) => m.BookingModule)
      }
    ]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./page/login/login.module').then((m) => m.LoginModule)
  },
  { path: '', redirectTo: '/home/shop', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
