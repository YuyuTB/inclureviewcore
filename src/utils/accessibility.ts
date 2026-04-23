import { JSXAttribute, JSXSpreadAttribute } from "@babel/types";
import { hasAriaLabel } from "./ast/jsx/jsxUtils.js";

export function isAriaAccessible(
  attrs: (JSXAttribute | JSXSpreadAttribute)[],
): boolean {
  return hasAriaLabel(attrs);
}
