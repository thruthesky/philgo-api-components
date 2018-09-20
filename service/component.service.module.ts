import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentService } from './component.service';
import { MatDialogModule, MatSnackBarModule, MatButtonModule } from '@angular/material';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [
    DialogComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  providers: [
    ComponentService
  ]
})
export class ComponentServiceModule { }
