import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LoginInterface } from 'src/app/utilities/interfaces/global.interface';
import { LocalStorageService } from 'src/app/utilities/services/local-storage-service/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public readonly showPassword$ = new BehaviorSubject<number>(1);
  public readonly fg = this._newFg();

  constructor(
    private _localS: LocalStorageService,
  ) { }

  public onSubmit() {
    const { Username, Password } = this.fg.value;
    this._localS.object.setItem<LoginInterface>('lastSuccessLogin', { Username, Password });
  }

  private _newFg() {
    const lastSuccessLogin = this._localS.object.getItem<LoginInterface>('lastSuccessLogin');
    return new FormGroup({
      Username: new FormControl<string | undefined | null>(lastSuccessLogin?.Username),
      Password: new FormControl<string | undefined | null>(lastSuccessLogin?.Password),
    });
  }
}
