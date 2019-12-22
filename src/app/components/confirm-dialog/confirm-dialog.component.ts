import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  okText = 'Ok';
  message = 'Are you sure ?';
  title = 'Info';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {
    if (data) {
      this.title = data.title || 'Info';
      this.okText = data.okText || 'Ok';
      this.message = data.message || 'Are you sure ?';
    }

  }

  ngOnInit() {
  }

  onSubmit() {
    this.dialogRef.close(true);
  }

}
