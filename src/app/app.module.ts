import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule }    from '@angular/common/http';

import { AppComponent } from './app.component';
import { TableContentComponent } from './components/table-content/table-content.component';
import { TimeLineComponent } from './components/time-line/time-line.component';
import { DocumentsService } from './services/documents.service';
import { EventsService } from './services/events.service';



@NgModule({
    declarations: [
        AppComponent,
        TableContentComponent,
        TimeLineComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule
    ],
    providers: [DocumentsService, EventsService],
    bootstrap: [AppComponent]
})
export class AppModule { }
