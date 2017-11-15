import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { TableContentComponent } from './table-content/table-content.component';
import { TimeLineComponent } from './time-line/time-line.component';


@NgModule({
  declarations: [
    AppComponent,
    TableContentComponent,
    TimeLineComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
