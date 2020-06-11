import { Injectable, TemplateRef } from '@angular/core';
import { TagTemplateMap, TemplatableTagName, isTagName, PseudoTagName, TagName } from '../utilities/types';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class TemplateService {
  private readonly templates$ = new BehaviorSubject<TagTemplateMap>({});

  readonly ready$ = this.templates$.pipe(
    filter(templates => (
      Object.values({ ...TemplatableTagName, ...PseudoTagName })
        .every(tagName => tagName in templates)
    ))
  );

  get(tagName: TagName): TemplateRef<unknown> {
    const template = this.templates$.value[tagName];
    if (template == null) {
      throw new Error(`Template for "${tagName}" not registered!`);
    }

    return template;
  }

  /**
   * Associates a given tag or entity with a default or user-defined template.
   * @param tagName An HTML tag or entity.
   * @param template A reference to the <ng-template> to use.
   * @param isDefault Whether the registered template is *not* user-defined.
   */
  register(tagName: string, template: TemplateRef<unknown>, isDefault: boolean): void {
    if (isDefault && !isTagName(tagName, true)) {
      console.error(`Error in default template: unknown tag "${tagName}".`);
      return;
    }

    if (!isDefault && !isTagName(tagName)) {
      const templatableTags = Object.values(TemplatableTagName);
      console.warn(
      `A template for unsupported tag "${tagName}" provided.\n` +
      `Supported tags: ${templatableTags.join(', ')}.`);
      return;
    }

    const { value } = this.templates$;
    if (!isDefault || !(tagName in value)) {
      this.templates$.next({...value, [tagName]: template});
    }
  }
}
