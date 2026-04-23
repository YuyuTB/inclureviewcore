import { NodePath } from "@babel/traverse";
import { Node } from "@babel/types";

export function findParentJSXElement(
  path: NodePath<Node>,
): NodePath<Node> | null {
  let current: NodePath<Node> | null = path.parentPath;
  while (current && current.node.type !== "JSXElement") {
    current = current.parentPath;
  }
  return current && current.node.type === "JSXElement" ? current : null;
}

export function findAncestorOfType(
  path: NodePath<Node>,
  type: string,
): NodePath<Node> | null {
  let current: NodePath<Node> | null = path.parentPath;
  while (current && current.node.type !== type) {
    current = current.parentPath;
  }
  return current && current.node.type === type ? current : null;
}
