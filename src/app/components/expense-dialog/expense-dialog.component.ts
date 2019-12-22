import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/services/app.service';
import { HttpService } from 'src/app/services/http.service';
import { Urls } from 'src/app/utils/urls';

@Component({
  selector: 'app-expense-dialog',
  templateUrl: './expense-dialog.component.html',
  styleUrls: ['./expense-dialog.component.css']
})
export class ExpenseDialogComponent implements OnInit {
  expense: any = { date: new Date().toISOString().split('T')[0] };
  categories: any[] = [];
  editMode: boolean;
  viewMode: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ExpenseDialogComponent>,
    private appSrv: AppService,
    private httpSrv: HttpService
  ) {
    console.log(data);

    if (data) {
      this.expense = data.expense;
      this.editMode = data.editMode;
      this.viewMode = data.viewMode;
      if (data.expense) {
        this.expense.date = this.expense.date ? this.expense.date.split('T')[0] : null;
      }
    }
  }

  ngOnInit() {
    this._loadCategories();
  }

  close() {
    this.dialogRef.close();
  }


  private async _loadCategories() {
    try {
      this.categories = await this.httpSrv.get(Urls.CATEGORY_API).then((res: any) => res.data || []);
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to load');
    }
  }

  public onSubmit() {
    if (!this.expense.name) {
      this.appSrv.showMissing('Please enter name');
      return;
    }
    if (isNaN(this.expense.amount) || !this.expense.amount || this.expense.amount < 1) {
      this.appSrv.showMissing('Please enter valid amount');
      return;
    }
    if (this.expense._id) {
      this._update();
    } else {
      this._create();
    }
  }


  private async _create() {
    try {
      const data = await this.httpSrv.create(Urls.EXPENSE_API, this.expense).then((res: any) => res.data);
      if (data) {
        this.appSrv.showSuccess('Saved successfully');
        this.dialogRef.close(data);
      }
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Save failed');
    }
  }

  private async _update() {
    try {
      const data = await this.httpSrv.update(Urls.EXPENSE_API, this.expense._id, this.expense).then((res: any) => res.data);
      if (data) {
        this.appSrv.showSuccess('Updated successfully');
        this.dialogRef.close(data);
      }
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Updat failed');
    }
  }

  public compareFn(obj1: any, obj2: any) {
    console.log('Obj1 ', obj1);
    console.log('Obj2 ', obj2);

    return obj1 && obj2 ? (obj1._id || obj1) === (obj2._id || obj2) : false;
  }


}
