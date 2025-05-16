import { Component } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Helper } from 'src/app/utilities/classes/helper-class';
import { PromptMessage } from 'src/app/utilities/classes/prompt-class';
import { LoginInterface } from 'src/app/utilities/interfaces/global.interface';
import { LocalStorageService } from 'src/app/utilities/services/local-storage-service/local-storage.service';
import { RoutesService } from 'src/app/utilities/services/routes-service/routes.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public readonly prompt$ = new PromptMessage();
  public readonly showPassword$ = new BehaviorSubject<number>(1);
  public readonly showConfirmPassword$ = new BehaviorSubject<number>(1);
  public readonly fg = this._newFg();

  constructor(
    public routes: RoutesService,
    private _localS: LocalStorageService,
    private _router: Router,
  ) { }

  public onSubmit() {
    const { Email, Password } = this.fg.value;
    if (Helper.forms.getInvalidControls(this.fg).length) {
      this.prompt$.next(Helper.forms.errorMsg.requiredFields, 'text-red-400');
      return;
    }
    this.prompt$.clear();
    this._localS.object.setItem<LoginInterface>('lastSuccessLogin', { Email, Password });


  }

  private _newFg() {
    return new FormGroup({
      Email: Helper.forms.controls<string>(undefined, [Validators.required]),
      Password: Helper.forms.controls<string>(undefined, [Validators.required]),
      ConfirmPassword: Helper.forms.controls<string>(undefined, [Validators.required]),
    });
  }
}
