import { TemplateRef } from '@angular/core';

/**
 * Map of tag names (see `SUPPORTED_TAGS`) to template refs.
 */
export interface TagTemplateMap {
  [tagName: string]: TemplateRef<any>;
}

/**
 * Node split instruction (see `AstNode.split`).
 */
export interface AstNodeSplit {
  delimiter: string;
  tagName: string;
}

/**
 * Output AST node.
 */
export class AstNode {
  parent: AstNode | null = null;
  readonly children: AstNode[] = [];

  /**
   * Joint text of all descendant text-leafs.
   */
  get text(): string {
    return this.tagName === 'text' ?
      this.ownText :
      this.children.map(({text}) => text).join('');
  }

  constructor(public readonly tagName: string,
              public readonly ownText: string = '',
              public readonly url: string = '') { }

  /**
   * Two-way connects a child node to `this`.
   * @param node The to-be child node.
   * @returns The passed child node with updated `parent` property.
   */
  appendChild(node: AstNode): AstNode {
    node.parent = this;
    this.children.push(node);
    return node;
  }

  /**
   * Splits a parented text node to multiple siblings interlaid with delimiter
   * nodes according to node's own text and given string delimiters.
   * @param instructions An array of split instructions consisting of string
   *                     delimiters to split by and tag names of inserted nodes.
   */
  split(instructions: AstNodeSplit[]): void {
    if (this.parent == null || instructions.length === 0) {
      return;
    }

    const {delimiter, tagName} = instructions[0];
    const thisIndex = this.parent.children.indexOf(this);
    const splitNodes: AstNode[] = this.ownText
      .split(delimiter)
      .flatMap((substring, index) => [
        ...index !== 0 ? [new AstNode(tagName)] : [],
        new AstNode('text', substring)
      ]);

    splitNodes.forEach(node => {
      node.parent = this.parent;
    });
    this.parent.children.splice(thisIndex, 1, ...splitNodes);
    this.parent = null;

    splitNodes
      .filter(node => node.tagName === 'text')
      .forEach(node => {
        node.split(instructions.slice(1));
      });
  }
}

/**
 * Types of templatable output objects (HTML tags and entities; text nodes).
 * - 'text' -- text node.
 * - 'root' -- document container node.
 */
export const SUPPORTED_TAGS: string[] = [
  'a',
  'article',
  'blockquote',
  'code',
  'del',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hellip',
  'hr',
  'img',
  'li',
  'mdash',
  'ndash',
  'ol',
  'p',
  'pre',
  'strong',
  'text',
  'ul',
];
