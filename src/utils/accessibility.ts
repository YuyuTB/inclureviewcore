import { JSXAttribute, JSXSpreadAttribute } from "@babel/types";
import { hasAriaLabel } from "./jsx.js";

export function isAriaAccessible(
  attrs: (JSXAttribute | JSXSpreadAttribute)[],
): boolean {
  return hasAriaLabel(attrs);
}
