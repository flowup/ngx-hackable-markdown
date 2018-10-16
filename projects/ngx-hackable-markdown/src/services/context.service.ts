import { Injectable } from '@angular/core';
import { AstNode, TagTemplateMap } from '../utilities/types';

/**
 * Synchronous global state through which directives can communicate with
 * their children.
 */
@Injectable()
export class ContextService {
  currentNode: AstNode;
  templates: TagTemplateMap;
}
