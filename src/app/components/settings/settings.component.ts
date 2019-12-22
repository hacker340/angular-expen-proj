import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { AppService } from 'src/app/services/app.service';
import { Urls } from 'src/app/utils/urls';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  settings: any = { amount: 0 };
  category: any = {};
  categories: any[] = [];
  constructor(
    private httpSrv: HttpService,
    private appSrv: AppService
  ) { }

  ngOnInit() {
    this._loadSettings();
    this._loadCategories();
  }

  private async _loadSettings() {
    try {
      // const data = await this.httpSrv.getById(Urls.SETTINGS_API, this.settings._id).then((res: any) => res.data);
      this.settings = await this.httpSrv.get(Urls.SETTINGS_API).then((res: any) => res.data.length ? res.data[0] : {});
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to load');
    }
  }

  private async _loadCategories() {
    try {
      const data = await this.httpSrv.get(Urls.CATEGORY_API).then((res: any) => res.data);
      if (data) {
        this.categories = data;
        console.log(this.categories);

      }
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to load');
    }
  }

  public async onSave() {
    if (isNaN(this.settings.amount) || !this.settings.amount || this.settings.amount < 0) {
      this.appSrv.showMissing('Enter valid amount');
      return;
    }
    try {
      if (this.settings._id) {
        const data = await this.httpSrv.update(Urls.SETTINGS_API, this.settings._id, this.settings).then((res: any) => res.data);
        if (data) {
          this.settings = data;
          this._loadCategories();
          this.appSrv.showSuccess('Saved Successfully');
        }
      } else {
        const data = await this.httpSrv.create(Urls.SETTINGS_API, this.settings).then((res: any) => res.data);
        if (data) {
          this.settings = data;
          this.appSrv.showSuccess('Saved Successfully');
        }
      }
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to save');
    }
  }

  public async onCategoryAdd() {
    if (!this.category.name) {
      this.appSrv.showMissing('Enter category name');
      return;
    }
    try {
      const data = await this.httpSrv.create(Urls.CATEGORY_API, this.category).then((res: any) => res.data);
      if (data) {
        this.category = {};
        this.appSrv.showSuccess('Category added');
        this._loadCategories();
      }
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to save');
    }
  }

  onDeleteCategory(expense) {
    this.appSrv.openConfirmDialog({
      title: 'Confirm',
      message: 'Are you sure to delete?',
      okText: 'Ok'
    }).then((res: any) => {
      if (res) {
        expense.isDeleted = true;
        this._updateCategory(expense, 'Category deleted');
      }
    });
  }

  // onDeleteCategory(category: any) {
  //   category.isDeleted = true;
  //   this._updateCategory(category, 'Category deleted');
  // }

  onDeleteUndo(category: any) {
    category.isDeleted = false;
    this._updateCategory(category, 'Undo successfully');
  }

  private async _updateCategory(category: any, msg?: string) {
    try {
      const data = await this.httpSrv.update(Urls.CATEGORY_API, category._id, category).then((res: any) => res.data);
      if (data) {
        this.category = {};
        this.appSrv.showSuccess(msg || 'Category updated');
        this._loadCategories();
      }
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to save');
    }
  }
}
