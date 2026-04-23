import { parse } from "@babel/parser";
import type { NodePath } from "@babel/traverse";
import * as rules from "./rules/index.js";
import { Issue } from "./types/Issue.js";
import { Rule } from "./types/Rule.js";

/**
 * Analyze a file and return accessibility issues.
 */
export async function analyze(code: string, file: string): Promise<Issue[]> {
  let ast;
  let traverse: any;
  try {
    traverse = (await import("@babel/traverse")).default;
  } catch (e) {
    throw new Error("Failed to load @babel/traverse: " + e);
  }

  try {
    ast = parse(code, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  } catch (error) {
    return [
      {
        ruleId: "parse_error",
        severity: "high",
        file,
        line: 0,
        message: "Failed to parse file",
        fixSuggestion: "Ensure the file contains valid syntax",
      },
    ];
  }

  const issues: Issue[] = [];
  const ruleList: Rule[] = Object.values(rules);

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
          // fail-safe: a rule should never crash the engine
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

  return issues;
}
