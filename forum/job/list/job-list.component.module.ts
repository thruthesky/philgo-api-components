import { NgModule } from '@angular/core';
import { JobListComponent } from './job-list.component';
import { CommonModule } from '@angular/common';
import { JobEditComponentModule } from '../edit/job-edit.component.module';
import { JobViewComponent } from '../view/job.view.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        JobEditComponentModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatButtonModule
    ],
    declarations: [
        JobListComponent,
        JobViewComponent,
        // MenuPopoverComponent
    ],
    entryComponents: [
        JobViewComponent,
        // MenuPopoverComponent
    ],
    exports: [
        JobListComponent
    ],
    providers: [],
})
export class JobListComponentModule { }
