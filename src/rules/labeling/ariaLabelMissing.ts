import { Rule } from "../../types/issue/Rule.js";
import { getJSXAttributeValue } from "../../utils/ast/jsx/jsxUtils.js";
import { findParentJSXElement } from "../../utils/ast/dom/domUtils.js";
import { isJSXButton, isJSXInput } from "../../utils/ast/predicates/index.js";
import { hasAriaLabel } from "../../utils/ast/jsx/jsxUtils.js";
import { AriaLabelMissingRuleReturn } from "../../models/ruleReturn/AriaLabelMissingRuleReturn.js";
import { JSXOpeningElement } from "@babel/types";

export const ariaLabelMissing: Rule = (path, file) => {
  // Check for <button>
  if (isJSXButton(path)) {
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
    if (
      !hasText &&
      path.node.type === "JSXOpeningElement" &&
      !hasAriaLabel((path.node as JSXOpeningElement).attributes)
    ) {
      return new AriaLabelMissingRuleReturn(
        file,
        path.node.loc?.start.line || 0,
        { tag: "button" },
      );
    }
  }
  // Check for <input type="button|submit|reset|image">
  if (isJSXInput(path)) {
    if (path.node.type !== "JSXOpeningElement") return null;
    const attributes = (path.node as JSXOpeningElement).attributes;
    const typeAttr = attributes
      .map((attr) => getJSXAttributeValue(attr as any, "type"))
      .find((val) =>
        ["button", "submit", "reset", "image"].includes(val || ""),
      );
    if (!typeAttr) return null;
    const hasValue = attributes.some((attr) => {
      const val = getJSXAttributeValue(attr as any, "value");
      return val && val.trim() !== "";
    });
    if (!hasValue && !hasAriaLabel(attributes)) {
      return new AriaLabelMissingRuleReturn(
        file,
        path.node.loc?.start.line || 0,
        { tag: "input" },
      );
    }
  }
  return null;
};
