import { Directive, ViewContainerRef } from '@angular/core';
import { ContextService } from '../services/context.service';

@Directive({
  selector: '[ngxHackableChildren]'
})
export class ChildrenDirective {
  constructor(context: ContextService,
              viewContainer: ViewContainerRef) {
    (context.currentNode.children || []).forEach(node => {
      context.currentNode = node;
      viewContainer.createEmbeddedView(context.templates[node.tagName], node);
    });
  }
}
