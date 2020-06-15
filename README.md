# ngx-hackable-markdown

A **customizable** Markdown renderer wrapped in an Angular component.

- **Template-driven** -- accepts `ng-template`s overriding how HTML tags and entities are rendered.
- **Angular-Universal-friendly** -- works with server-side rendering.

**This is a 0.x.x version. Breaking API changes might come and bugs might occur!**

## Installation

```
npm install --save ngx-hackable-markdown
```

## Example

### my.module.ts
```typescript
@NgModule({
  imports: [
    CommonModule,
    HackableMarkdownModule, // DON'T FORGET TO IMPORT
  ],
  declarations: [MyComponent],
  exports: [MyComponent]
})
export class MyModule { }
```

### my.component.html
```html
<div [ngxHackableMarkdown]="markdownSource">

  <!--styled spans surrouned by guillemets instead of strongs-->
  <ng-template ngxHackableTag="strong" let-children="children">
    <span style="font-weight: bold">
      <ng-container>&raquo;</ng-container>
      <ng-container [ngxHackableChildren]="children"></ng-container>
      <ng-container>&laquo;</ng-container>
    </span>
  </ng-template>

  <!--blue triple bullets instead of ellipses-->
  <ng-template ngxHackableTag="hellip">
    <span style="color: blue">&bull; &bull; &bull;</span>
  </ng-template>

  <!--heading IDs based on their text contents-->
  <ng-template ngxHackableTag="h1" let-content="content" let-children="children">
    <h1 [id]="content | myTransformPipe">
      <ng-container [ngxHackableChildren]="children"></ng-container>
    </h1>
  </ng-template>

  <!--custom buttons instead of links-->
  <ng-template ngxHackableTag="a" let-metadata="metadata" let-children="children">
    <button (click)="myRedirectHandler(metadata[0])"
            [title]="metadata[1]">
      <ng-container [ngxHackableChildren]="children"></ng-container>
    </button>
  </ng-template>

</div>
```

## Templating capabilities

The `ngxHackableTag` directive should **always** adorn an `ng-template` and accepts the following arguments:

- HTML tags: `a`, `blockquote`, `code`, `del`, `em`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `hr`, `img`, `li`, `ol`, `p`, `pre`, `strong`, `ul`.
- HTML entities: `ndash` (rendered from `--`), `mdash` (rendered from `---`), `hellip` (rendered from `...`).

The view-nesting `[ngxHackableChildren]` directive adorning an `ng-container` can (and usually **should**) be used inside templates for all HTML tags except `hr` and `img`.

The following view context properties can be used in templates (see the example above):

- `content` -- the object's recursive text content.
- `metadata` -- an array of metadata like URL, title, etc. Exposed in `a` and `img` templates. E.g. `[foo](bar "baz plox")` yields `['bar', 'baz plox']`
- `children` -- a reference to the given node's children that should be passed to the `[ngxHackableChildren]` directive.

See [this cheat-sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) (or inspect rendered DOM) in case of uncertainty about which Markdown syntax maps to a given tag.
