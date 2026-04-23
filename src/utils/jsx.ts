import {
  JSXAttribute,
  JSXSpreadAttribute,
  JSXIdentifier,
  Node,
} from "@babel/types";

export function isJSXAttribute(
  attr: JSXAttribute | JSXSpreadAttribute,
): attr is JSXAttribute {
  return attr.type === "JSXAttribute";
}

export function isJSXIdentifier(node: Node | undefined): node is JSXIdentifier {
  return !!node && node.type === "JSXIdentifier";
}

export function getJSXAttributeValue(
  attr: JSXAttribute | JSXSpreadAttribute,
  name: string,
): string | null {
  if (
    isJSXAttribute(attr) &&
    isJSXIdentifier(attr.name) &&
    attr.name.name === name &&
    attr.value
  ) {
    if (attr.value.type === "StringLiteral") return attr.value.value;
    if (
      attr.value.type === "JSXExpressionContainer" &&
      attr.value.expression.type === "StringLiteral"
    )
      return attr.value.expression.value;
  }
  return null;
}

export function hasAriaLabel(
  attrs: (JSXAttribute | JSXSpreadAttribute)[],
): boolean {
  return attrs.some(
    (attr) =>
      isJSXAttribute(attr) &&
      isJSXIdentifier(attr.name) &&
      (attr.name.name === "aria-label" || attr.name.name === "aria-labelledby"),
  );
}
