import { Rule } from "../../types/issue/Rule.js";
import { HeadingStructureRuleReturn } from "../../models/ruleReturn/HeadingStructureRuleReturn.js";
import { isHTMLElement } from "../../utils/ast/html/htmlNodeUtils.js";

function getOrInitHeadings(file: string) {
  if (!(globalThis as any).__a11y_headings) {
    (globalThis as any).__a11y_headings = [];
  }
  return (globalThis as any).__a11y_headings as {
    level: number;
    file: string;
    line: number;
  }[];
}

export const headingStructure: Rule = (path: any, file: string) => {
  // JSX/Babel
  if (
    typeof path.isJSXOpeningElement === "function" &&
    path.isJSXOpeningElement()
  ) {
    const namePath = path.get("name");
    if (!namePath.isJSXIdentifier()) return null;
    const tag = namePath.node.name;
    if (!/^h[1-6]$/.test(tag)) return null;
    const headings = getOrInitHeadings(file);
    const level = parseInt(tag[1], 10);
    const line = path.node.loc?.start.line || 0;
    const prev = headings.filter((h) => h.file === file).slice(-1)[0];
    headings.push({ level, file, line });
    if (
      level === 1 &&
      headings.filter((h) => h.file === file && h.level === 1).length > 1
    ) {
      return new HeadingStructureRuleReturn(
        file,
        path.node.loc?.start.line || 0,
        path.node.loc?.start.column || 0,
        path.node.loc?.end?.line,
        path.node.loc?.end?.column,
        { type: "multipleH1" },
      );
    }
    if (prev && level > prev.level + 1) {
      return new HeadingStructureRuleReturn(
        file,
        path.node.loc?.start.line || 0,
        path.node.loc?.start.column || 0,
        path.node.loc?.end?.line,
        path.node.loc?.end?.column,
        {
          type: "skippedLevel",
          prevLevel: prev.level,
          level,
        },
      );
    }
    if (
      level !== 1 &&
      headings.filter((h) => h.file === file && h.level === 1).length === 0 &&
      headings.filter((h) => h.file === file).length === 1
    ) {
      return new HeadingStructureRuleReturn(
        file,
        path.node.loc?.start.line || 0,
        path.node.loc?.start.column || 0,
        path.node.loc?.end?.line,
        path.node.loc?.end?.column,
        { type: "missingH1" },
      );
    }
    return null;
  }

  // HTML/parse5
  if (
    path.node &&
    typeof path.node.tagName === "string" &&
    /^h[1-6]$/.test(path.node.tagName)
  ) {
    const tag = path.node.tagName;
    const headings = getOrInitHeadings(file);
    const level = parseInt(tag[1], 10);
    const line = path.node.sourceCodeLocation?.startLine || 0;
    const prev = headings.filter((h) => h.file === file).slice(-1)[0];
    headings.push({ level, file, line });
    if (
      level === 1 &&
      headings.filter((h) => h.file === file && h.level === 1).length > 1
    ) {
      return new HeadingStructureRuleReturn(
        file,
        path.node.sourceCodeLocation?.startLine || 0,
        path.node.sourceCodeLocation?.startCol || 0,
        path.node.sourceCodeLocation?.endLine,
        path.node.sourceCodeLocation?.endCol,
        { type: "multipleH1" },
      );
    }
    if (prev && level > prev.level + 1) {
      return new HeadingStructureRuleReturn(
        file,
        path.node.sourceCodeLocation?.startLine || 0,
        path.node.sourceCodeLocation?.startCol || 0,
        path.node.sourceCodeLocation?.endLine,
        path.node.sourceCodeLocation?.endCol,
        {
          type: "skippedLevel",
          prevLevel: prev.level,
          level,
        },
      );
    }
    if (
      level !== 1 &&
      headings.filter((h) => h.file === file && h.level === 1).length === 0 &&
      headings.filter((h) => h.file === file).length === 1
    ) {
      return new HeadingStructureRuleReturn(
        file,
        path.node.sourceCodeLocation?.startLine || 0,
        path.node.sourceCodeLocation?.startCol || 0,
        path.node.sourceCodeLocation?.endLine,
        path.node.sourceCodeLocation?.endCol,
        { type: "missingH1" },
      );
    }
    return null;
  }
  return null;
};
