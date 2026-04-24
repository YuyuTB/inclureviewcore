import { parse as babelParse } from "@babel/parser";
import type { NodePath } from "@babel/traverse";
import { parseHTMLTemplate } from "../utils/ast/fileTypeUtils/html/htmlUtils.js";
import type { Rule } from "../types/issue/Rule.js";
import type { Issue } from "../types/issue/Issue.js";

export function traverseHTMLTree(
  node: any,
  ruleList: Rule[],
  file: string,
  issues: Issue[],
  parentLine = 0,
) {
  for (const rule of ruleList) {
    try {
      let loc;
      if (node.sourceCodeLocation) {
        loc = {
          start: {
            line: node.sourceCodeLocation.startLine,
            column: node.sourceCodeLocation.startCol,
          },
          end: {
            line: node.sourceCodeLocation.endLine,
            column: node.sourceCodeLocation.endCol,
          },
        };
      } else {
        loc = { start: { line: parentLine, column: 0 } };
      }
      const fakePath = {
        node,
        parent: null,
        parentPath: null,
        nodeType: node.nodeName,
        file,
        loc,
      };
      const result = rule(fakePath as any, file);
      if (Array.isArray(result)) {
        issues.push(...result);
      } else if (result) {
        issues.push(result);
      }
    } catch (err) {
      issues.push({
        ruleId: "rule_error",
        severity: "low",
        file,
        startLine: node.sourceCodeLocation?.startLine || parentLine,
        startColumn: node.sourceCodeLocation?.startCol || 0,
        endLine: node.sourceCodeLocation?.endLine || parentLine,
        endColumn: node.sourceCodeLocation?.endCol || 0,
        message: `Rule execution failed (HTML/Vue)`,
        fixSuggestion: "Check rule implementation",
      });
    }
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      traverseHTMLTree(child, ruleList, file, issues, parentLine);
    }
  }
}

export async function analyzeHTMLTemplate(
  template: string,
  ruleList: Rule[],
  file: string,
  issues: Issue[],
) {
  const fragment = parseHTMLTemplate(template);
  traverseHTMLTree(fragment, ruleList, file, issues, 1);
}

export async function analyzeJSXTemplate(
  template: string,
  ruleList: Rule[],
  file: string,
  issues: Issue[],
  traverse: any,
) {
  let ast;
  try {
    const hasJSX = /<\w+|<[A-Z]/.test(template);
    const plugins = ["typescript"];
    if (
      hasJSX ||
      file.endsWith(".jsx") ||
      file.endsWith(".tsx") ||
      file.endsWith(".js")
    ) {
      plugins.unshift("jsx");
    }
    ast = babelParse(template, {
      sourceType: "module",
      plugins: plugins as any,
    });
  } catch (error) {
    issues.push({
      ruleId: "parse_error",
      severity: "high",
      file,
      startLine: 0,
      startColumn: 0,
      endLine: 0,
      endColumn: 0,
      message: "Failed to parse template block",
      fixSuggestion: "Ensure the template contains valid syntax",
    });
    return;
  }
  traverse(ast, {
    enter(path: NodePath) {
      for (const rule of ruleList) {
        try {
          const result = rule(path, file);
          if (Array.isArray(result)) {
            issues.push(...result);
          } else if (result) {
            issues.push(result);
          }
        } catch (err) {
          issues.push({
            ruleId: "rule_error",
            severity: "low",
            file,
            startLine: path.node.loc?.start.line || 0,
            startColumn: path.node.loc?.start.column || 0,
            endLine: path.node.loc?.end?.line,
            endColumn: path.node.loc?.end?.column,
            message: `Rule execution failed`,
            fixSuggestion: "Check rule implementation",
          });
        }
      }
    },
  });
}
