import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HackableMarkdownModule } from 'ngx-hackable-markdown';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HackableMarkdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
