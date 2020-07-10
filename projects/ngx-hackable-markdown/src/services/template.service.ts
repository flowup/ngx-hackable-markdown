import { Injectable, TemplateRef } from '@angular/core';
import { TagTemplateMap, TemplatableTagName, isTagName, PseudoTagName, TagName } from '../utilities/types';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class TemplateService {
  static readonly defaultSuffix = ':default';

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

  register(tagName: string, template: TemplateRef<unknown>): void {
    const isDefault = tagName.endsWith(TemplateService.defaultSuffix);
    const [cleanTagName] = tagName.split(TemplateService.defaultSuffix);

    if (isDefault && !isTagName(cleanTagName, true)) {
      console.error(`Error in default template: unknown "${cleanTagName}".`);
      return;
    }

    if (!isDefault && !isTagName(cleanTagName)) {
      const templatableTags = Object.values(TemplatableTagName);
      console.warn(
        `A template for unsupported tag "${cleanTagName}" provided.\n` +
        `Supported tags: ${templatableTags.join(', ')}.`
      );
      return;
    }

    const { value } = this.templates$;
    if (!isDefault || !(cleanTagName in value)) {
      this.templates$.next({...value, [cleanTagName]: template});
    }
  }
}
