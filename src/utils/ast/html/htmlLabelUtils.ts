// Utilities for label/aria/alt checks on parse5 HTML nodes
import { getHTMLAttribute, isHTMLElement } from "./htmlNodeUtils.js";

export function hasHTMLAriaLabel(node: any): boolean {
  const aria =
    getHTMLAttribute(node, "aria-label") ||
    getHTMLAttribute(node, "aria-labelledby");
  return !!aria;
}

export function hasHTMLAlt(node: any): boolean {
  return getHTMLAttribute(node, "alt") !== null;
}

export function hasHTMLInputLabel(node: any, parent: any): boolean {
  if (!isHTMLElement(node, "input")) return false;
  // Check for label parent
  if (parent && isHTMLElement(parent, "label")) return true;
  // Check for aria-label/aria-labelledby
  if (hasHTMLAriaLabel(node)) return true;
  // Check for id/for association
  const id = getHTMLAttribute(node, "id");
  if (id && parent && getHTMLAttribute(parent, "for") === id) return true;
  return false;
}
