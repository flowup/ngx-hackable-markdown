import { NgModule } from '@angular/core';
import { RootComponent } from './components/root.component';
import { ChildrenDirective } from './directives/children.directive';
import { TemplateDirective } from './directives/template.directive';
import { TemplateService } from './services/template.service';

@NgModule({
  declarations: [
    RootComponent,
    ChildrenDirective,
    TemplateDirective,
  ],
  exports: [
    RootComponent,
    ChildrenDirective,
    TemplateDirective,
  ],
  providers: [
    TemplateService,
  ]
})
export class HackableMarkdownModule { }
