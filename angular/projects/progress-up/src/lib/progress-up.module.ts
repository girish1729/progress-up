import { NgModule } from '@angular/core';
import { ProgressUpComponent } from './progress-up.component';
import {
    ProgressUpService
} from './progress-up.service';
export {
    ProgressUpService
} from './progress-up.service';

@NgModule({
  declarations: [
    ProgressUpComponent
  ],
  imports: [
  ],
  exports: [
    ProgressUpComponent
  ],
  providers: [
    ProgressUpService
  ]
})

export class ProgressUpModule { }

