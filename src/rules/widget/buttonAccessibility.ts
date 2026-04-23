import { Rule } from "../../types/issue/Rule.js";
import { getJSXAttributeValue } from "../../utils/ast/jsx/jsxUtils.js";
import {
  findParentJSXElement,
  findAncestorOfType,
} from "../../utils/ast/dom/domUtils.js";
import { isJSXButton } from "../../utils/ast/predicates/index.js";
import { hasAriaLabel } from "../../utils/ast/jsx/jsxUtils.js";
import { ButtonAccessibilityRuleReturn } from "../../models/ruleReturn/ButtonAccessibilityRuleReturn.js";

export const buttonAccessibility: Rule = (path: any, file: any) => {
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
    return new ButtonAccessibilityRuleReturn(
      file,
      path.node.loc?.start.line || 0,
      { type: "missingText" },
    );
  }
  const typeAttr = path.node.attributes
    .map((attr: any) => getJSXAttributeValue(attr, "type"))
    .find((val: any) => val === "submit" || val === "reset");
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
      return new ButtonAccessibilityRuleReturn(
        file,
        path.node.loc?.start.line || 0,
        { type: "typeOutsideForm" },
      );
    }
  }
  return null;
};
