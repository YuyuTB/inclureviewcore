import { Rule } from "../../types/issue/Rule.js";
import { ColorContrastRuleReturn } from "../../models/ruleReturn/ColorContrastRuleReturn.js";
import {
  getHTMLAttribute,
  isHTMLElement,
} from "../../utils/ast/html/htmlNodeUtils.js";

export const colorContrast: Rule = (path: any, file: any) => {
  // JSX/Babel
  if (
    typeof path.isJSXOpeningElement === "function" &&
    path.isJSXOpeningElement()
  ) {
    const namePath = path.get("name");
    if (!namePath.isJSXIdentifier()) return null;
    const styleAttr = path.node.attributes.find(
      (attr: any) =>
        attr.type === "JSXAttribute" &&
        attr.name.type === "JSXIdentifier" &&
        attr.name.name === "style" &&
        attr.value &&
        attr.value.type === "JSXExpressionContainer" &&
        attr.value.expression.type === "ObjectExpression",
    );
    if (
      styleAttr &&
      styleAttr.type === "JSXAttribute" &&
      styleAttr.value &&
      styleAttr.value.type === "JSXExpressionContainer"
    ) {
      const obj = styleAttr.value.expression;
      if (obj.type === "ObjectExpression") {
        let hasColor = false;
        let hasBg = false;
        for (const prop of obj.properties) {
          if (
            prop.type === "ObjectProperty" &&
            prop.key.type === "Identifier"
          ) {
            if (prop.key.name === "color") hasColor = true;
            if (prop.key.name === "backgroundColor") hasBg = true;
          }
        }
        if (hasColor && hasBg) {
          return new ColorContrastRuleReturn(
            file,
            path.node.loc?.start.line || 0,
          );
        }
      }
    }
    const hasColorAttr = path.node.attributes.some(
      (attr: any) =>
        attr.type === "JSXAttribute" &&
        attr.name.type === "JSXIdentifier" &&
        (attr.name.name === "color" || attr.name.name === "bgcolor"),
    );
    if (hasColorAttr) {
      return new ColorContrastRuleReturn(file, path.node.loc?.start.line || 0);
    }
    return null;
  }

  // HTML/parse5
  if (path.node && typeof path.node.tagName === "string") {
    // Inline style attribute (not parsed, just check for presence)
    const styleAttr = getHTMLAttribute(path.node, "style");
    // Color and bgcolor attributes
    const colorAttr = getHTMLAttribute(path.node, "color");
    const bgColorAttr = getHTMLAttribute(path.node, "bgcolor");
    if (
      (styleAttr &&
        styleAttr.includes("color") &&
        styleAttr.includes("background")) ||
      (colorAttr && bgColorAttr)
    ) {
      return new ColorContrastRuleReturn(
        file,
        path.node.sourceCodeLocation?.startLine || 0,
      );
    }
  }
  return null;
};
