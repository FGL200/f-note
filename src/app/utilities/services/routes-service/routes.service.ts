import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  public readonly login = '/auth/login';
  public readonly register = '/auth/register';
  public readonly forgotPassword = '/auth/forgot-password';
  public readonly resetPassword = '/auth/reset-password';
  
  public readonly home = '/home';
  public readonly dashboard = '/home/dashboard';

  constructor() { }
}
