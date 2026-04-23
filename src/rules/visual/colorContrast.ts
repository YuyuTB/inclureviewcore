import { Rule } from "../../types/Rule";
import { ColorContrastSuggestion } from "../../types/suggestions/ColorContrast";

export const colorContrast: Rule = (path, file) => {
  if (!path.isJSXOpeningElement()) return null;
  const namePath = path.get("name");
  if (!namePath.isJSXIdentifier()) return null;
  const styleAttr = path.node.attributes.find(
    (attr) =>
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
        if (prop.type === "ObjectProperty" && prop.key.type === "Identifier") {
          if (prop.key.name === "color") hasColor = true;
          if (prop.key.name === "backgroundColor") hasBg = true;
        }
      }
      if (hasColor && hasBg) {
        return new ColorContrastSuggestion(
          file,
          path.node.loc?.start.line || 0,
        );
      }
    }
  }
  const hasColorAttr = path.node.attributes.some(
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name.type === "JSXIdentifier" &&
      (attr.name.name === "color" || attr.name.name === "bgcolor"),
  );
  if (hasColorAttr) {
    return new ColorContrastSuggestion(file, path.node.loc?.start.line || 0);
  }
  return null;
};
