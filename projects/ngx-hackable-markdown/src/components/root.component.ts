import { Component, Input, OnDestroy, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { PseudoTagName, TemplatableTagName, AstNode } from '../utilities/types';
import { parseMarkdown } from '../utilities/parser';
import { TemplateService } from '../services/template.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: '[ngxHackableMarkdown]',
  templateUrl: './root.component.html',
  providers: [TemplateService],
})
export class RootComponent implements OnInit, OnDestroy {
  readonly TemplatableTagName = TemplatableTagName;
  readonly PseudoTagName = PseudoTagName;
  readonly defaultSuffix = TemplateService.defaultSuffix;

  @ViewChild('viewContainer', {read: ViewContainerRef})
  set viewContainer(viewContainer: ViewContainerRef) {
    this.viewContainer$.next(viewContainer);
  }

  @Input('ngxHackableMarkdown')
  set markdown(markdown: string) {
    this.astRoot$.next(parseMarkdown(markdown));
  }

  private readonly astRoot$ = new BehaviorSubject<AstNode | null>(null);
  private readonly viewContainer$ = new BehaviorSubject<ViewContainerRef | null>(null);

  constructor(private readonly templates: TemplateService) { }

  ngOnInit(): void {
    combineLatest(this.astRoot$, this.viewContainer$, this.templates.ready$)
      .pipe(delay(0)) // ExpressionChangedAfterItHasBeenCheckedError
      .subscribe(([astRoot, viewContainer]) => {
        if (astRoot == null || viewContainer == null) {
          return;
        }

        viewContainer.clear();
        viewContainer.createEmbeddedView(
          this.templates.get(astRoot.tagName),
          astRoot
        );
      });
  }

  ngOnDestroy(): void {
    this.viewContainer$.complete();
    this.astRoot$.complete();
  }
}
