import * as MarkdownIt from 'markdown-it';
import { AstNode, SUPPORTED_TAGS } from './types';

/**
 * Transforms a markdown source text to a traversable AST.
 * @param source A markdown source text.
 * @returns The root node of the parsed AST.
 */
export function parseMarkdown(source: string): AstNode {
  const flatTokens: MarkdownIt.Token[] = (new MarkdownIt())
    .parse(source, {})
    .flatMap(token => token.type === 'inline' ? token.children : token);

  let currentNode = new AstNode('article');

  flatTokens.forEach(token => {
    const [type, suffix] = token.type.match(/^.*?(_open|_close)?$/)!;
    switch (suffix || type) {
      case '_open':
        if (SUPPORTED_TAGS.includes(token.tag)) {
          currentNode = currentNode.appendChild(
            new AstNode(token.tag, '', token.attrGet('href') || '')
          );
        }
        break;

      case '_close':
        if (SUPPORTED_TAGS.includes(token.tag)) {
          currentNode = currentNode.parent!;
        }
        break;

      case 'text':
        currentNode
          .appendChild(new AstNode('text', token.content))
          .split([
            {delimiter: '---', tagName: 'mdash'},
            {delimiter: '--', tagName: 'ndash'},
            {delimiter: '...', tagName: 'hellip'},
          ]);
        break;

      case 'code_inline':
        currentNode
          .appendChild(new AstNode('code'))
          .appendChild(new AstNode('text', token.content));
        break;

      case 'fence':
        currentNode
          .appendChild(new AstNode('pre'))
          .appendChild(new AstNode('text', token.content));
        break;

      case 'hr':
        currentNode.appendChild(new AstNode('hr'));
        break;

      case 'image':
        currentNode.appendChild(
          new AstNode('img', '', token.attrGet('src') || '')
        );
        break;
    }
  });

  return currentNode;
}
