import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { MatFormFieldModule, MatInputModule, MatButtonModule } from '@angular/material';
import { RouterModule } from '@angular/router';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    RouterModule,
  ],
  declarations: [
      LoginComponent
  ],
  exports: [
      LoginComponent
  ]
})
export class LoginComponentModule {}
