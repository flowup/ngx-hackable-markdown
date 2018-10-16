import { Directive, TemplateRef, Host, Input } from '@angular/core';
import { RootComponent } from '../components/root.component';

@Directive({
  selector: '[ngxHackableTag]'
})
export class TemplateDirective {
  constructor(private readonly template: TemplateRef<any>,
              @Host() private readonly host: RootComponent) { }

  /**
   * Registers an <ng-template> associated with a given tag or entity.
   * @param config A config string consisting of a supported tag or entity and
   *               an optional `:default` suffix indicating a non-user-defined
   *               template being registered.
   */
  @Input('ngxHackableTag')
  set tagName(config: string) {
    const tagName = config.split(':')[0];
    const isDefault = config.endsWith(':default');
    this.host.registerTemplate(tagName, this.template, isDefault);
  }
}
