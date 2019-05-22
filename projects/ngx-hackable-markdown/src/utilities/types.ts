import { TemplateRef } from '@angular/core';

/**
 * Templatable HTML tags and entities.
 */
export enum TemplatableTagName {
  A = 'a',
  Blockquote = 'blockquote',
  Code = 'code',
  Del = 'del',
  Em = 'em',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  Hellip = 'hellip',
  Hr = 'hr',
  Img = 'img',
  Li = 'li',
  Mdash = 'mdash',
  Ndash = 'ndash',
  Ol = 'ol',
  P = 'p',
  Pre = 'pre',
  Strong = 'strong',
  Ul = 'ul',
}

/**
 * Non-templatable helper node types.
 */
export enum PseudoTagName {
  Root = '__root__',
  Text = '__text__',
}

export type TagName
  = TemplatableTagName
  | PseudoTagName;

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
  tagName: TagName;
}

/**
 * Output AST node.
 */
export class AstNode {
  static readonly contentLeafs: TagName[] = [
    PseudoTagName.Text,
    TemplatableTagName.Img
  ];

  parent: AstNode | null = null;
  readonly children: AstNode[] = [];

  /**
   * Joint text content of all descendant text-leafs.
   */
  get content(): string {
    return AstNode.contentLeafs.includes(this.tagName) ?
      this.ownContent :
      this.children.map(({content}) => content).join('');
  }

  constructor(public readonly tagName: TagName,
              public readonly ownContent: string = '',
              public readonly metadata: string[] = []) { }

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
   * nodes according to node's own text content and given string delimiters.
   * @param instructions An array of split instructions consisting of string
   *                     delimiters to split by and tag names of inserted nodes.
   */
  split(instructions: AstNodeSplit[]): void {
    if (this.parent == null || instructions.length === 0) {
      return;
    }

    const {delimiter, tagName} = instructions[0];
    const thisIndex = this.parent.children.indexOf(this);
    const splitNodes: AstNode[] = this.ownContent
      .split(delimiter)
      .reduce((acc, substring, index) => [
        ...acc,
        ...index !== 0 ? [new AstNode(tagName)] : [],
        new AstNode(PseudoTagName.Text, substring)
      ], []);

    splitNodes.forEach(node => {
      node.parent = this.parent;
    });
    this.parent.children.splice(thisIndex, 1, ...splitNodes);
    this.parent = null;

    splitNodes
      .filter(node => node.tagName === PseudoTagName.Text)
      .forEach(node => {
        node.split(instructions.slice(1));
      });
  }
}

export const DEFAULT_TEMPLATE_SUFFIX = ':default';
