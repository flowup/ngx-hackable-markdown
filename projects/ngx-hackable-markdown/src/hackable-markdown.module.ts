import { NgModule } from '@angular/core';
import { RootComponent } from './components/root.component';
import { ChildrenDirective } from './directives/children.directive';
import { TemplateDirective } from './directives/template.directive';
import { ContextService } from './services/context.service';

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
    ContextService,
  ]
})
export class HackableMarkdownModule { }
