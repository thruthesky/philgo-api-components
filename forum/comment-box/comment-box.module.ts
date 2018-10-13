import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentBoxComponent } from './comment-box.component';
import { DisplayFilesModule } from '../../display-files/display-files.module';
import { FormsModule } from '@angular/forms';
import { ComponentServiceModule } from '../../service/component.service.module';
import { MatProgressSpinnerModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DisplayFilesModule,
    ComponentServiceModule,
    MatProgressSpinnerModule
  ],
  declarations: [CommentBoxComponent],
  exports: [CommentBoxComponent]
})
export class CommentBoxModule { }
