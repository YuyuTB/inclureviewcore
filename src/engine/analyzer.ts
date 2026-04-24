import * as rules from "../rules/index.js";
import { Issue } from "../types/issue/Issue.js";
import { Rule } from "../types/issue/Rule.js";
import {
  findTemplates,
  isJSFile,
  isJSXFile,
  isVueFile,
  isHTMLFile,
  extractJSTemplates,
} from "../utils/ast/predicates/index.js";

import {
  analyzeHTMLTemplate,
  analyzeJSXTemplate,
} from "./templateAnalyzers.js";

/**
 * Analyze a file and return accessibility issues.
 */
export async function analyze(code: string, file: string): Promise<Issue[]> {
  let traverse: any;
  try {
    traverse = (await import("@babel/traverse")).default;
  } catch (e) {
    throw new Error("Failed to load @babel/traverse: " + e);
  }

  const templates = await findTemplates(file, code);
  if (!templates.length) {
    return [];
  }

  const issues: Issue[] = [];
  const ruleList: Rule[] = Object.values(rules);

  for (const template of templates) {
    const isAngularLike =
      file.endsWith(".ts") &&
      extractJSTemplates(code).some((t) => t === template);
    if (isAngularLike || isHTMLFile(file) || isVueFile(file)) {
      await analyzeHTMLTemplate(template, ruleList, file, issues);
    } else if (isJSFile(file) || isJSXFile(file)) {
      await analyzeJSXTemplate(template, ruleList, file, issues, traverse);
    }
  }

  return issues;
}
