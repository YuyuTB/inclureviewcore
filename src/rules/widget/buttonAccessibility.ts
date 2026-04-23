import { Rule } from "../../types/issue/Rule.js";
import {
  getJSXAttributeValue,
  hasAriaLabel,
} from "../../utils/ast/fileTypeUtils/jsx/jsxUtils.js";
import { findParentJSXElement } from "../../utils/ast/dom/domUtils.js";
import { isJSXButton } from "../../utils/ast/predicates/index.js";
import { ButtonAccessibilityRuleReturn } from "../../models/ruleReturn/ButtonAccessibilityRuleReturn.js";
import { hasHTMLAriaLabel } from "../../utils/ast/html/htmlLabelUtils.js";
import {
  getHTMLAttribute,
  isHTMLElement,
} from "../../utils/ast/html/htmlNodeUtils.js";

export const buttonAccessibility: Rule = (path: any, file: string) => {
  // JSX/Babel
  if (
    typeof path.isJSXOpeningElement === "function" &&
    path.isJSXOpeningElement()
  ) {
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
  }

  // HTML/parse5
  if (path.node && isHTMLElement(path.node, "button")) {
    const hasAria = hasHTMLAriaLabel(path.node);
    let hasText = false;
    if (Array.isArray(path.node.childNodes)) {
      hasText = path.node.childNodes.some((child: any) => {
        return (
          child.nodeName === "#text" && child.value && child.value.trim() !== ""
        );
      });
    }
    if (!hasText && !hasAria) {
      return new ButtonAccessibilityRuleReturn(
        file,
        path.node.sourceCodeLocation?.startLine || 0,
        { type: "missingText" },
      );
    }
    // Check type attribute
    const typeAttr = getHTMLAttribute(path.node, "type");
    if (
      (typeAttr === "submit" || typeAttr === "reset") &&
      (hasText || hasAria)
    ) {
      // Check if inside a form (walk ancestors if available)
      let ancestor = path.parent;
      let inForm = false;
      while (ancestor) {
        if (isHTMLElement(ancestor.node, "form")) {
          inForm = true;
          break;
        }
        ancestor = ancestor.parent;
      }
      if (!inForm) {
        return new ButtonAccessibilityRuleReturn(
          file,
          path.node.sourceCodeLocation?.startLine || 0,
          { type: "typeOutsideForm" },
        );
      }
    }
    return null;
  }
  return null;
};
