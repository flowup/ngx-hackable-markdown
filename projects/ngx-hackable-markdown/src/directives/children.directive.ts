import { Directive, ViewContainerRef, Input } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { AstNode } from '../utilities/types';

@Directive({
  selector: '[ngxHackableChildren]'
})
export class ChildrenDirective {
  constructor(private readonly templates: TemplateService,
              private readonly viewContainer: ViewContainerRef) { }

  @Input('ngxHackableChildren')
  set children(children: AstNode[]) {
    children.forEach(node => {
      this.viewContainer.createEmbeddedView(
        this.templates.get(node.tagName),
        node
      );
    });
  }
}
