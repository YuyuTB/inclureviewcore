import { Issue } from "../Issue";
import { Severity } from "../Severity";

export class AriaLabelMissingSuggestion implements Issue {
  ruleId: string;
  severity: Severity;
  message: string;
  fixSuggestion: string;
  constructor(
    public file: string,
    public line: number,
    opts: { tag: "button" | "input" } = { tag: "button" },
  ) {
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
