import { Component, Input, OnDestroy, ViewChild, ViewContainerRef, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { PseudoTagName, TemplatableTagName, AstNode } from '../utilities/types';
import { parseMarkdown } from '../utilities/parser';
import { TemplateService } from '../services/template.service';

@Component({
  selector: '[ngxHackableMarkdown]',
  templateUrl: './root.component.html',
  providers: [TemplateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  set markdown(markdown: unknown) {
    const rootNode = parseMarkdown(Boolean(markdown) ? String(markdown) : '');
    this.astRoot$.next(rootNode);
  }

  private readonly astRoot$ = new BehaviorSubject<AstNode | null>(null);
  private readonly viewContainer$ = new BehaviorSubject<ViewContainerRef | null>(null);

  constructor(
    private readonly templates: TemplateService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    combineLatest(this.astRoot$, this.viewContainer$, this.templates.ready$)
      .subscribe(([astRoot, viewContainer]) => {
        if (astRoot == null || viewContainer == null) {
          return;
        }

        viewContainer.clear();
        viewContainer.createEmbeddedView(
          this.templates.get(astRoot.tagName),
          astRoot
        );

        this.cdr.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.viewContainer$.complete();
    this.astRoot$.complete();
  }
}
