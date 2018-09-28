import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobEditComponent } from './job-edit.component';
import { FormsModule } from '@angular/forms';
// import { FilesComponentModule } from '../../files/files.module';
import { ComponentServiceModule } from '../../../service/component.service.module';
import {
  MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule,
  MatSelectModule
} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // FilesComponentModule,
    ComponentServiceModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
  ],
  declarations: [JobEditComponent],
  exports: [JobEditComponent]
})
export class JobEditComponentModule { }
