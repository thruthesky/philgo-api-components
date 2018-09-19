import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayFilesComponent } from './display-files.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DisplayFilesComponent],
  exports: [DisplayFilesComponent]
})
export class DisplayFilesModule { }
