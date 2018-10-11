import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayFilesComponent } from './display-files.component';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  declarations: [DisplayFilesComponent],
  exports: [DisplayFilesComponent]
})
export class DisplayFilesModule { }
