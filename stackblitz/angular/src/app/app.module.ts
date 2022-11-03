import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ProgressUpModule } from 'progress-up';

import { AppComponent } from './app.component';

@NgModule({
  imports: [BrowserModule, FormsModule, ProgressUpModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
