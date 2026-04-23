import type { NodePath } from "@babel/traverse";
import { isJSXIdentifier } from "../../jsx/jsxUtils.js";

export function isJSXButton(path: NodePath): boolean {
  if (!path.isJSXOpeningElement()) return false;
  const nameNode = path.get("name").node;
  return isJSXIdentifier(nameNode) && nameNode.name === "button";
}

export function isJSXInput(path: NodePath): boolean {
  if (!path.isJSXOpeningElement()) return false;
  const nameNode = path.get("name").node;
  return isJSXIdentifier(nameNode) && nameNode.name === "input";
}
