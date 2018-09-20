import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumBasicListComponent } from './forum-basic-list.component';
import { DisplayFilesModule } from '../../../display-files/display-files.module';
import { ForumBasicViewComponent } from '../forum-basic-view/forum-basic-view.component';
import { ForumBasicReplyComponent } from '../forum-basic-reply/forum-basic-reply.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DisplayFilesModule
  ],
  declarations: [
    ForumBasicListComponent,
    ForumBasicViewComponent,
    ForumBasicReplyComponent
  ],
  exports: [
    ForumBasicListComponent
  ]
})
export class ForumBasicListModule { }
