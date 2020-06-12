import * as MarkdownIt from 'markdown-it';
import * as Token from 'markdown-it/lib/token';
import { AstNode, PseudoTagName, TemplatableTagName, isTagName } from './types';

/**
 * Transforms a markdown source text to a traversable AST.
 * @param source A markdown source text.
 * @returns The root node of the parsed AST.
 */
export function parseMarkdown(source: string): AstNode {
  const tokens: Token[] = (new MarkdownIt())
    .parse(source, {})
    .reduce((acc, token) => [
      ...acc,
      ...(token.type === 'inline' ? token.children || [] : [token])
    ], []);

  let currentNode = new AstNode(PseudoTagName.Root);

  tokens.forEach(token => {
    const [type, suffix] = token.type.match(/^.*?(_open|_close)?$/)!;
    switch (suffix || type) {
      case '_open':
        if (isTagName(token.tag)) {
          const metadata: string[] = TemplatableTagName.A ?
            [
              token.attrGet('href') || '',
              token.attrGet('title') || '',
              token.attrGet('style') || '',
            ] :
            [];
          currentNode = currentNode.appendChild(
            new AstNode(token.tag as TemplatableTagName, '', metadata)
          );
        }
        break;

      case '_close':
        if (isTagName(token.tag)) {
          currentNode = currentNode.parent!;
        }
        break;

      case 'text':
        currentNode
          .appendChild(new AstNode(PseudoTagName.Text, token.content))
          .split([
            {delimiter: '---', tagName: TemplatableTagName.Mdash},
            {delimiter: '--', tagName: TemplatableTagName.Ndash},
            {delimiter: '...', tagName: TemplatableTagName.Hellip},
          ]);
        break;

      case 'code_inline':
        currentNode
          .appendChild(new AstNode(TemplatableTagName.Code))
          .appendChild(new AstNode(PseudoTagName.Text, token.content));
        break;

      case 'fence':
        currentNode
          .appendChild(new AstNode(TemplatableTagName.Pre))
          .appendChild(new AstNode(PseudoTagName.Text, token.content));
        break;

      case 'hr':
        currentNode.appendChild(new AstNode(TemplatableTagName.Hr));
        break;

      case 'image':
        currentNode.appendChild(
          new AstNode(
            TemplatableTagName.Img,
            token.content || '',
            [
              token.attrGet('src') || '',
              token.attrGet('title') || '',
            ]
          )
        );
        break;
    }
  });

  return currentNode;
}
