import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

export class ColorContrastRuleReturn implements Issue {
  ruleId = "color_contrast";
  severity: Severity = "medium";
  message =
    "Element sets both color and backgroundColor inline. Contrast not checked.";
  fixSuggestion = "Ensure sufficient color contrast.";
  constructor(
    public file: string,
    public line: number,
  ) {}
}
