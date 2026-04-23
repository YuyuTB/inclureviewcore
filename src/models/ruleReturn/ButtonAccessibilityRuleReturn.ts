import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

export class ButtonAccessibilityRuleReturn implements Issue {
  ruleId: string;
  severity: Severity;
  message: string;
  fixSuggestion: string;
  constructor(
    public file: string,
    public line: number,
    opts: { type: "missingText" | "typeOutsideForm" } = { type: "missingText" },
  ) {
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
