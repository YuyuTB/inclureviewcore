import { Rule } from "../../types/issue/Rule.js";
import { findParentJSXElement } from "../../utils/ast/dom/domUtils.js";
import { isJSXButton, isJSXInput } from "../../utils/ast/predicates/index.js";
import { AriaLabelMissingRuleReturn } from "../../models/ruleReturn/AriaLabelMissingRuleReturn.js";
import { hasHTMLAriaLabel } from "../../utils/ast/html/htmlLabelUtils.js";
import {
  getJSXAttributeValue,
  hasAriaLabel,
} from "../../utils/ast/fileTypeUtils/jsx/jsxUtils.js";
import {
  getHTMLAttribute,
  isHTMLElement,
} from "../../utils/ast/html/htmlNodeUtils.js";

export const ariaLabelMissing: Rule = (path: any, file: string) => {
  // JSX/Babel
  if (typeof path.isJSXOpeningElement === "function" && isJSXButton(path)) {
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
      !hasAriaLabel(path.node.attributes)
    ) {
      return new AriaLabelMissingRuleReturn(
        file,
        path.node.loc?.start.line || 0,
        { tag: "button" },
      );
    }
  }
  // JSX input
  if (typeof path.isJSXOpeningElement === "function" && isJSXInput(path)) {
    if (path.node.type !== "JSXOpeningElement") return null;
    const attributes = path.node.attributes;
    const typeAttr = attributes
      .map((attr: any) => getJSXAttributeValue(attr, "type"))
      .find((val: any) =>
        ["button", "submit", "reset", "image"].includes(val || ""),
      );
    if (!typeAttr) return null;
    const hasValue = attributes.some((attr: any) => {
      const val = getJSXAttributeValue(attr, "value");
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
  // HTML/parse5 button
  if (path.node && isHTMLElement(path.node, "button")) {
    let hasText = false;
    if (Array.isArray(path.node.childNodes)) {
      hasText = path.node.childNodes.some((child: any) => {
        return (
          child.nodeName === "#text" && child.value && child.value.trim() !== ""
        );
      });
    }
    if (!hasText && !hasHTMLAriaLabel(path.node)) {
      return new AriaLabelMissingRuleReturn(
        file,
        path.node.sourceCodeLocation?.startLine || 0,
        { tag: "button" },
      );
    }
  }
  // HTML/parse5 input
  if (path.node && isHTMLElement(path.node, "input")) {
    const typeAttr = getHTMLAttribute(path.node, "type");
    if (["button", "submit", "reset", "image"].includes(typeAttr || "")) {
      const valueAttr = getHTMLAttribute(path.node, "value");
      if (!valueAttr && !hasHTMLAriaLabel(path.node)) {
        return new AriaLabelMissingRuleReturn(
          file,
          path.node.sourceCodeLocation?.startLine || 0,
          { tag: "input" },
        );
      }
    }
  }
  return null;
};
