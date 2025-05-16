import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './f-notes/authentication/login/login.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'auth', loadChildren: () => import('./f-notes/authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'home', loadChildren: () => import('./f-notes/home/home.module').then(m => m.HomeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
