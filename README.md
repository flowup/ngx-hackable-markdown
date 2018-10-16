# ngx-hackable-markdown

A **customizable** Markdown renderer wrapped in an Angular component.

- **Template-driven** -- accepts `ng-template`s overriding how HTML tags and entities are rendered.
- **Angular-Universal-friendly** -- works with server-side rendering.

**This is a 0.x.x version. Breaking API changes might come and bugs might occur!**

## Example

```html
<ngx-hackable-markdown [source]="markdownSource">
  
  <!--styled spans surrouned by guillemets instead of strongs-->
  <ng-template ngxHackableTag="strong">
    <span style="font-weight: bold">
      <ng-container>&raquo;</ng-container>
      <ng-container ngxHackableChildren></ng-container>
      <ng-container>&laquo;</ng-container>
    </strong>
  </ng-template>
  
  <!--blue triple bullets instead of ellipses-->
  <ng-template ngxHackableTag="hellip">
    <span class="color: blue">&bull; &bull; &bull;</span>
  </ng-template>
  
  <!--heading IDs based on their text contents-->
  <ng-template ngxHackableTag="h1" let-text="text">
    <h1 [id]="text | myTransformPipe">
      <ng-container ngxHackableChildren></ng-container>
    </h1>
  </ng-template>
  
  <!--custom buttons instead of links-->
  <ng-template ngxHackableTag="a" let-url="url">
    <button (click)="myRedirectHandler(url)">
      <ng-container ngxHackableChildren></ng-container>
    </button>
  </ng-template>
  
</ngx-hackable-markdown>
```

## Templating capabilities

The `ngxHackableTag` directive should **always** adorn an `ng-template` and accepts the following arguments:

- HTML tags: `a`, `article`, `blockquote`, `code`, `del`, `em`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `hr`, `img`, `li`, `ol`, `p`, `pre`, `strong`, `ul`.
- HTML entities: `ndash` (rendered from double-dash), `mdash` (rendered from triple-dash), `hellip` (rendered from triple-dot).

The view-nesting `ngxHackableChildren` directive adorning an `ng-container` can (and usually **should**) be used inside templates for all HTML tags except `hr` and `img`.

The following view context properties can be used in templates (see the example above):

- `text` -- the object's recursive text content.
- `url` -- resource URL (exposed in `a` and `img` templates).

See [this cheat-sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) (or inspect rendered DOM) in case of uncertainty about which Markdown syntax maps to a given tag. 

## License

Copyright 2018 FlowUp, s.r.o.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
