import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  defaultConfig: MatSnackBarConfig = {
    duration: 6000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  constructor(private _snackBar: MatSnackBar) {}

  alertError(
    message: string,
    config: MatSnackBarConfig = this.defaultConfig,
    action: string = 'Dismiss'
  ) {
    config.panelClass = ['alert', 'alert-error'];
    this._snackBar.dismiss();
    this._snackBar.open(message, action, config);
  }

  alertWarning(
    message: string,
    config: MatSnackBarConfig = this.defaultConfig,
    action: string = 'Dismiss'
  ) {
    config.panelClass = ['alert', 'alert-warning'];
    this._snackBar.dismiss();
    this._snackBar.open(message, action, config);
  }

  alertSuccess(
    message: string,
    config: MatSnackBarConfig = this.defaultConfig,
    action: string = 'Dismiss'
  ) {
    config.panelClass = ['alert', 'alert-success'];
    this._snackBar.dismiss();
    this._snackBar.open(message, action, config);
  }
}
