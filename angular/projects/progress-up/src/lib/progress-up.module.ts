import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressUpComponent } from './progress-up.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

import {PdfViewerModule} from 'ng2-pdf-viewer';
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
    FormsModule,	
    PdfViewerModule
  ],
})

export class ProgressUpModule { }
