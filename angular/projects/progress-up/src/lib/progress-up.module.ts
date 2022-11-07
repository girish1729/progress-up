import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressUpComponent } from './progress-up.component';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    ProgressUpComponent
  ],
  exports: [
    ProgressUpComponent
  ],
  imports: [
    CommonModule,
    DragDropModule
  ],
})

export class ProgressUpModule { }
