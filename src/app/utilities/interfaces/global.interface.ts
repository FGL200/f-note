import { AbstractControl } from "@angular/forms";

export interface EnvironmentInterface {
  baseURL: string;
  websiteURL: string;
  production: boolean;
  version: string;
}

export interface LoginInterface {
  Email: string | undefined | null;
  Password: string | undefined | null;
}

export interface InvalidControlInreface {
  control: AbstractControl,
  key: string
}