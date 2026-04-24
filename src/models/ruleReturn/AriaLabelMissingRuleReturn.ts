import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

export class AriaLabelMissingRuleReturn implements Issue {
  ruleId: string;
  severity: Severity;
  message: string;
  fixSuggestion: string;
  file: string;
  startLine: number;
  startColumn: number;
  endLine?: number;
  endColumn?: number;
  tag: "button" | "input";
  constructor(
    file: string,
    startLine: number,
    startColumn: number,
    endLine?: number,
    endColumn?: number,
    opts: { tag: "button" | "input" } = { tag: "button" },
  ) {
    this.file = file;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.endLine = endLine;
    this.endColumn = endColumn;
    this.tag = opts.tag;
    this.ruleId = "aria_label_missing";
    this.severity = "high";
    if (opts.tag === "button") {
      this.message = "Button is missing accessible text or aria-label";
      this.fixSuggestion = "Add text or aria-label to the button.";
    } else {
      this.message = "Input button is missing value or aria-label";
      this.fixSuggestion = "Add value or aria-label to the input button.";
    }
  }
}
