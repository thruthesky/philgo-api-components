import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { ComponentServiceModule } from '../../service/component.service.module';
import {
  MatFormFieldModule, MatInputModule, MatListModule, MatButtonModule, MatSelectModule,
  MatProgressSpinnerModule, MatSpinner, MatProgressBar, MatProgressBarModule, MatRadioModule
} from '@angular/material';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatRadioModule,
    ComponentServiceModule
  ],
  declarations: [
    RegisterComponent
  ],
  exports: [
    RegisterComponent
  ]
})
export class RegisterComponentModule {}
