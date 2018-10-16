import { Component, Input, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SUPPORTED_TAGS, TagTemplateMap } from '../utilities/types';
import { parseMarkdown } from '../utilities/parser';
import { ContextService } from '../services/context.service';

@Component({
  selector: 'ngx-hackable-markdown',
  templateUrl: './root.component.html',
})
export class RootComponent implements OnDestroy {

  /**
   * Streamifies a reference to the component-contained view container into
   * which the root node shall be rendered into.
   */
  @ViewChild('viewContainer', {read: ViewContainerRef})
  set viewContainer(viewContainer: ViewContainerRef) {
    this.viewContainer$.next(viewContainer);
  }

  /**
   * Streamifies inputted markdown source texts.
   */
  @Input()
  set source(markdown: string | null | undefined) {
    this.markdown$.next(markdown || '');
  }

  private readonly viewContainer$ = new Subject<ViewContainerRef>();
  private readonly markdown$ = new BehaviorSubject<string>('');
  private readonly templates$ = new BehaviorSubject<TagTemplateMap>({});

  constructor(private readonly context: ContextService) {
    const parsedMarkdown$ = this.markdown$.pipe(map(parseMarkdown));

    const readyTemplates$ = this.templates$.pipe(
      filter(templates => SUPPORTED_TAGS
        .every(tagName => tagName in templates)
      )
    );

    combineLatest(this.viewContainer$, parsedMarkdown$, readyTemplates$)
      .subscribe(([viewContainer, rootNode, templates]) => {
        viewContainer.clear();
        this.context.templates = templates;
        this.context.currentNode = rootNode;
        viewContainer.createEmbeddedView(
          templates[rootNode.tagName],
          rootNode
        );
      });
  }

  /**
   * Prevents RxJS-related memory leaks.
   */
  ngOnDestroy(): void {
    this.viewContainer$.complete();
    this.markdown$.complete();
    this.templates$.complete();
  }

  /**
   * Associates a given tag or entity with a default or user-defined template.
   * @param tagName A supported HTML tag or entity.
   * @param template A reference to the <ng-template> to use.
   * @param isDefault Whether the registered template is *not* user-defined.
   */
  registerTemplate(tagName: string,
                   template: TemplateRef<any>,
                   isDefault: boolean): void {
    if (!SUPPORTED_TAGS.includes(tagName)) {
      console.warn(
        `A template for unsupported tag "${tagName}" provided.\n` +
        `Supported tags: ${SUPPORTED_TAGS.join(', ')}.`);
      return;
    }

    const reggedTemplates = this.templates$.getValue();
    if (!isDefault || !(tagName in reggedTemplates)) {
      this.templates$.next({...reggedTemplates, [tagName]: template});
    }
  }
}
