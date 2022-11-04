import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressUpComponent } from './progress-up.component';

@NgModule({
  declarations: [
    ProgressUpComponent
  ],
  exports: [
    ProgressUpComponent
  ],
  imports: [
    CommonModule
  ],
})

export class ProgressUpModule { }
