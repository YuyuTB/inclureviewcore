// Extract Angular-style inline templates from .ts files
export function extractAngularLikeTemplates(source: string): string[] {
  // Match: template = `...` or template = '...'
  const match = source.match(/template\s*=\s*([`'])([\s\S]*?)\1/);
  if (match) {
    return [match[2]];
  }
  return [];
}
import type { NodePath } from "@babel/traverse";
import { isJSXIdentifier } from "../../fileTypeUtils/jsx/jsxUtils.js";

export function isJSXFile(filename: string): boolean {
  return (
    filename.endsWith(".jsx") ||
    filename.endsWith(".tsx") ||
    filename.endsWith(".ts") ||
    filename.endsWith(".js")
  );
}

export function extractJSXTemplates(source: string): string[] {
  // For JSX/TSX, the whole file is the template
  return [source];
}

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
