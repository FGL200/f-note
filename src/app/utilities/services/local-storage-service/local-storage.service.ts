import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public readonly string = {
    setItem: (key: string, value: string) => localStorage.setItem(key, value),
    getItem: (key: string) => localStorage.getItem(key),
  }

  public readonly number = {
    setItem: (key: string, value: number) => localStorage.setItem(key, String(value)),
    getItem: (key: string) => localStorage.getItem(key) ? Number(localStorage.getItem(key)) : null,
  }

  public readonly array = {
    setItem: <T>(key: string, value: T[]) => localStorage.setItem(key, JSON.stringify(value)),
    getItem: <T>(key: string) => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) ?? '[]') as T[] : null,
  }

  public readonly object = {
    setItem: <T>(key: string, value: T) => localStorage.setItem(key, JSON.stringify(value)),
    getItem: <T>(key: string) => localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key) ?? '{}') as T : null,
  }
}
