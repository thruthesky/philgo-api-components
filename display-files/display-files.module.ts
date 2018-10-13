import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayFilesComponent } from './display-files.component';
import { MatProgressBarModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  declarations: [DisplayFilesComponent],
  exports: [DisplayFilesComponent]
})
export class DisplayFilesModule { }
