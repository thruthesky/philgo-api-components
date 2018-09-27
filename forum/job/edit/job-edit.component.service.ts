import { Injectable } from '@angular/core';
import { JobEditComponent } from './job-edit.component';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';
@Injectable()
export class JobEditService {
  constructor(
    public dialog: MatDialog
  ) { }

  present(post): Observable<{ data?: any, role: 'success' | 'delete' | 'close' }> {

    const dialogRef = this.dialog.open(JobEditComponent, {
      data: post
    });

    return dialogRef.afterClosed();
  }
}
