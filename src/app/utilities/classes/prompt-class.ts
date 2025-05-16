import { BehaviorSubject } from "rxjs";

export class PromptMessage {

  public readonly subject = new BehaviorSubject<{ message?: string | null, classType?: string | null } | undefined>(undefined);
  private _timeout: any = undefined;

  constructor(
    message?: string | null,
    classType?: string | null,
    timeout: number = 6000
  ) {
    this.next(message, classType, timeout);
  }

  public next(
    message?: string | null,
    classType?: string | null,
    timeout: number = 6000
  ) {
    this.subject.next({ message, classType });
    if (this._timeout) this._clearTimeout();
    this._timeout = setTimeout(() => this.subject.next(undefined), timeout);
  }

  public clear() {
    this.subject.next(undefined);
    if (this._timeout) this._clearTimeout();
  }

  private _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = undefined;
  }
}