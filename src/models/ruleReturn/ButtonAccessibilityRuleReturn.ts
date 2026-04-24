import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

export class ButtonAccessibilityRuleReturn implements Issue {
  ruleId: string;
  severity: Severity;
  message: string;
  fixSuggestion: string;
  file: string;
  startLine: number;
  startColumn: number;
  endLine?: number;
  endColumn?: number;
  type: "missingText" | "typeOutsideForm";
  constructor(
    file: string,
    startLine: number,
    startColumn: number,
    endLine?: number,
    endColumn?: number,
    opts: { type: "missingText" | "typeOutsideForm" } = { type: "missingText" },
  ) {
    this.file = file;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.endLine = endLine;
    this.endColumn = endColumn;
    this.type = opts.type;
    if (opts.type === "missingText") {
      this.ruleId = "button_accessibility";
      this.severity = "high";
      this.message = "Button is missing accessible text or aria-label";
      this.fixSuggestion = "Add text or aria-label to the button.";
    } else {
      this.ruleId = "button_accessibility";
      this.severity = "medium";
      this.message =
        "Button with type='submit' or 'reset' is not inside a <form>";
      this.fixSuggestion = "Wrap button in a <form> or change its type.";
    }
  }
}
