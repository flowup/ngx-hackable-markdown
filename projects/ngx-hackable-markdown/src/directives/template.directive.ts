import { Directive, TemplateRef, Input, OnInit, OnDestroy } from '@angular/core';
import { TemplateService } from '../services/template.service';

@Directive({
  selector: '[ngxHackableTag]'
})
export class TemplateDirective {
  @Input('ngxHackableTag')
  set tagName(tagName: string) {
    this.templates.register(tagName, this.templateRef);
  }

  constructor(private readonly templateRef: TemplateRef<any>,
              private readonly templates: TemplateService) { }
}
