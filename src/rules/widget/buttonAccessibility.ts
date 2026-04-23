import { Rule } from "../../types/Rule";
import { getJSXAttributeValue, hasAriaLabel } from "../../utils/jsx";
import { findParentJSXElement, findAncestorOfType } from "../../utils/dom";
import { ButtonAccessibilitySuggestion } from "../../types/suggestions/ButtonAccessibility";

export const buttonAccessibility: Rule = (path, file) => {
  if (!path.isJSXOpeningElement()) return null;
  const namePath = path.get("name");
  if (!namePath.isJSXIdentifier({ name: "button" })) return null;
  const hasAria = hasAriaLabel(path.node.attributes);
  const buttonElement = findParentJSXElement(path);
  let hasText = false;
  if (
    buttonElement &&
    buttonElement.node &&
    Array.isArray((buttonElement.node as any).children)
  ) {
    hasText = (buttonElement.node as any).children.some((child: any) => {
      return (
        (child.type === "JSXText" && child.value.trim() !== "") ||
        (child.type === "JSXExpressionContainer" &&
          child.expression.type === "StringLiteral" &&
          child.expression.value.trim() !== "")
      );
    });
  }
  if (!hasText && !hasAria) {
    return new ButtonAccessibilitySuggestion(
      file,
      path.node.loc?.start.line || 0,
      { type: "missingText" },
    );
  }
  const typeAttr = path.node.attributes
    .map((attr) => getJSXAttributeValue(attr, "type"))
    .find((val) => val === "submit" || val === "reset");
  if (typeAttr && (hasText || hasAria)) {
    let ancestor: any = path.parentPath;
    let inForm = false;
    while (ancestor) {
      if (ancestor.node && ancestor.node.type === "JSXElement") {
        const jsxElem = ancestor.node;
        if (
          jsxElem.openingElement &&
          jsxElem.openingElement.name &&
          jsxElem.openingElement.name.type === "JSXIdentifier" &&
          jsxElem.openingElement.name.name === "form"
        ) {
          inForm = true;
          break;
        }
      }
      ancestor = ancestor.parentPath;
    }
    if (!inForm) {
      return new ButtonAccessibilitySuggestion(
        file,
        path.node.loc?.start.line || 0,
        { type: "typeOutsideForm" },
      );
    }
  }
  return null;
};
