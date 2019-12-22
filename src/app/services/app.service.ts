import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  public showSuccess(msg) {
    this.toastr.success(msg || 'Saved successfully', 'Success');
  }

  public showMissing(msg) {
    this.toastr.warning(msg || 'Missing fields', 'Info');
  }

  public showError(msg) {
    this.toastr.error(msg || 'Operation Faild', 'Error');
  }

  public openConfirmDialog(data?: any) {
    return new Promise((resolve: any, reject: any) => {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        minWidth: '600px',
        data
      });
      dialogRef.afterClosed().subscribe(res => {
        return resolve(res);
      });
    });
  }
}
