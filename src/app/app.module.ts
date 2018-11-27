import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HackableMarkdownModule } from 'ngx-hackable-markdown';
import { MyTransformPipe } from './my-transform.pipe';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MyTransformPipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HackableMarkdownModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
