import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

export class HeadingStructureRuleReturn implements Issue {
  ruleId: string;
  severity: Severity;
  message: string;
  fixSuggestion: string;
  file: string;
  startLine: number;
  startColumn: number;
  endLine?: number;
  endColumn?: number;
  type: "multipleH1" | "skippedLevel" | "missingH1";
  prevLevel?: number;
  level?: number;
  constructor(
    file: string,
    startLine: number,
    startColumn: number,
    endLine?: number,
    endColumn?: number,
    opts: {
      type: "multipleH1" | "skippedLevel" | "missingH1";
      prevLevel?: number;
      level?: number;
    } = { type: "multipleH1" },
  ) {
    this.file = file;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.endLine = endLine;
    this.endColumn = endColumn;
    this.type = opts.type;
    this.prevLevel = opts.prevLevel;
    this.level = opts.level;
    this.ruleId = "heading_structure";
    if (opts.type === "multipleH1") {
      this.severity = "medium";
      this.message = "Multiple <h1> elements found in file.";
      this.fixSuggestion = "Use only one <h1> per page.";
    } else if (opts.type === "skippedLevel") {
      this.severity = "low";
      this.message = `Skipped heading level: <h${opts.prevLevel}> to <h${opts.level}>`;
      this.fixSuggestion = `Use <h${(opts.prevLevel || 1) + 1}> after <h${opts.prevLevel}>.`;
    } else {
      this.severity = "medium";
      this.message = "No <h1> heading before other heading.";
      this.fixSuggestion = "Add a top-level <h1> heading.";
    }
  }
}
