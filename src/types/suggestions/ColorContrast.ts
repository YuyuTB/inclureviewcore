import { Issue } from "../Issue";
import { Severity } from "../Severity";

export class ColorContrastSuggestion implements Issue {
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
