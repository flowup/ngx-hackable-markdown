import { Directive, TemplateRef, Input, OnInit, OnDestroy } from '@angular/core';
import { TemplateService } from '../services/template.service';
import { BehaviorSubject, combineLatest } from 'rxjs';

@Directive({
  selector: '[ngxHackableTag]'
})
export class TemplateDirective implements OnInit, OnDestroy {
  private readonly tagName$ = new BehaviorSubject<string | null>(null);
  private readonly isDefault$ = new BehaviorSubject<boolean | null>(null);

  @Input('ngxHackableTag')
  set tagName(tagName: string) {
    this.tagName$.next(tagName);
  }

  @Input()
  set isDefault(isDefault: boolean) {
    this.isDefault$.next(isDefault);
  }

  constructor(private readonly templateRef: TemplateRef<any>,
              private readonly templates: TemplateService) { }

  ngOnInit(): void {
    combineLatest(this.tagName$, this.isDefault$)
      .subscribe(([tagName, isDefault]) => {
        if (tagName != null && isDefault != null) {
          this.templates.register(tagName, this.templateRef, isDefault);
        }
      });
  }

  ngOnDestroy(): void {
    this.tagName$.complete();
    this.isDefault$.complete();
  }
}
