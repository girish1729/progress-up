import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressUpComponent } from './progress-up.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ProgressUpComponent,  
  ],
  exports: [
    ProgressUpComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
})

export class ProgressUpModule { }
