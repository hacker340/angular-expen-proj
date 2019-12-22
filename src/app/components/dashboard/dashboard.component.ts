import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseDialogComponent } from '../expense-dialog/expense-dialog.component';
import { HttpService } from 'src/app/services/http.service';
import { AppService } from 'src/app/services/app.service';
import { Urls } from 'src/app/utils/urls';

import {Chart} from 'chart.js';

// const Chart = require('chart.js');

import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  expenses: any[] = [];
  categories: any[] = [];
  chartOne: any = {};
  chartTwo: any = {};
  settings: any = {};

  totalExpenseAmount = 0;
  totalPercent = 0;

  graphLabels: any[] = [];
  graphLabelAmounts: any = [];
  constructor(
    private dialog: MatDialog,
    private httpSrv: HttpService,
    private appSrv: AppService
  ) { }

  async ngOnInit() {
    await this._loadCategories();
    await this._loadSettings();
    await this._loadExpenses();
  }

  private async _loadSettings() {
    try {
      this.settings = await this.httpSrv.get(Urls.SETTINGS_API).then((res: any) => res.data.length ? res.data[0] : {});
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to load');
    }
  }

  private async _loadCategories() {
    try {
      this.categories = await this.httpSrv.get(Urls.CATEGORY_API, { isDeleted: false }).then((res: any) => res.data);
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Failed to load');
    }
  }

  private async _loadExpenses() {
    try {
      this.expenses = await this.httpSrv.get(Urls.EXPENSE_API).then((res: any) => res.data);
      this.totalExpenseAmount = 0;
      this.expenses.forEach(ex => {
        this.totalExpenseAmount += ex.amount;
      });
      this.totalPercent = (this.totalExpenseAmount / this.settings.amount * 100);
      const arr: any = _.groupBy(this.expenses, 'category._id');
      this.graphLabels = [];
      this.graphLabelAmounts = [];
      this.categories.forEach((cat: any) => {
        if (cat._id in arr) {
          const sum = _.sumBy(arr[cat._id], (o: any) => o.amount || 0);
          this.graphLabels.push(cat.name);
          this.graphLabelAmounts.push(sum);
        } else {
          this.graphLabels.push(cat.name);
          this.graphLabelAmounts.push(0);
        }
      });
      this.intChartOne();
      this.intChartTwo();
    } catch (err) {
      console.error(err);
      // this.appSrv.showError('Failed to load');
    }
  }

  openDialog(type: string, expense: any) {
    const data: any = {};
    if (expense) {
      data.expense = _.cloneDeep(expense);
    }
    if (type === 'editMode') {
      data.editMode = true;
    } else if (type === 'viewMode') {
      data.viewMode = true;
    }
    const dialogRef = this.dialog.open(ExpenseDialogComponent, {
      minWidth: '600px',
      data: !_.isEmpty(data) ? data : null
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      this._loadExpenses();
    });
  }

  onDeleteExpense(expense) {
    this.appSrv.openConfirmDialog({
      title: 'Confirm',
      message: 'Are you sure to delete?',
      okText: 'Ok'
    }).then((res: any) => {
      if (res) {
        expense.isDeleted = true;
        this._update(expense, 'Expense deleted');
      }
    });
  }

  onUndoDelete(expense) {
    expense.isDeleted = false;
    this._update(expense, 'Undo successfully');
  }

  private async _update(expense: any, msg?: string) {
    try {
      const data = await this.httpSrv.update(Urls.EXPENSE_API, expense._id, expense).then((res: any) => res.data);
      if (data) {
        this.appSrv.showSuccess(msg || 'Updated successfully');
        this._loadExpenses();
      }
    } catch (err) {
      console.error(err);
      this.appSrv.showError('Operation failed');
    }
  }



  intChartOne() {
    const ctx = document.getElementById('myChart');
    this.chartOne = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Expense Spent(%)', 'Budget(%)'],
        datasets: [{
          label: 'Budget details',
          data: [this.totalPercent.toFixed(2) || 0, (100 - parseFloat(this.totalPercent.toFixed(2))).toFixed(2)],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true,
        //     }
        //   }]
        // }
      }

      // Configuration options go here
    });
  }

  intChartTwo() {
    const ctx = document.getElementById('myChart2');
    this.chartTwo = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.graphLabels || [],
        datasets: [{
          label: 'Budget details',
          data: this.graphLabelAmounts || [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            // 'rgba(50, 168, 102, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            // 'rgba(50, 168, 102, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       beginAtZero: true
        //     }
        //   }]
        // }
      }

    });
  }
}
