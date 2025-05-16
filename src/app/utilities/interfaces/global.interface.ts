export interface EnvironmentInterface {
  baseURL: string;
  websiteURL: string;
  production: boolean;
  version: string;
}

export interface LoginInterface {
  Username: string | undefined | null;
  Password: string | undefined | null;
}