import { NgModule } from '@angular/core';
import { ProgressUpComponent } from './progress-up.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    ProgressUpComponent
  ],
  imports: [
    FontAwesomeModule
  ],
  exports: [
    ProgressUpComponent
  ]
})
export class ProgressUpModule { }
