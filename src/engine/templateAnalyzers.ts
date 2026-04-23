import { parse as babelParse } from "@babel/parser";
import type { NodePath } from "@babel/traverse";
import { parseHTMLTemplate } from "../utils/ast/fileTypeUtils/html/htmlUtils.js";
import type { Rule } from "../types/issue/Rule.js";
import type { Issue } from "../types/issue/Issue.js";

export function walkHTML(
  node: any,
  ruleList: Rule[],
  file: string,
  issues: Issue[],
  parentLine = 0,
) {
  for (const rule of ruleList) {
    try {
      const fakePath = {
        node,
        parent: null,
        parentPath: null,
        nodeType: node.nodeName,
        file,
        loc: { start: { line: parentLine } },
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
        line: parentLine,
        message: `Rule execution failed (HTML/Vue)`,
        fixSuggestion: "Check rule implementation",
      });
    }
  }
  if (node.childNodes) {
    for (const child of node.childNodes) {
      walkHTML(child, ruleList, file, issues, parentLine);
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
  walkHTML(fragment, ruleList, file, issues, 1);
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
      line: 0,
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
            line: path.node.loc?.start.line || 0,
            message: `Rule execution failed`,
            fixSuggestion: "Check rule implementation",
          });
        }
      }
    },
  });
}
