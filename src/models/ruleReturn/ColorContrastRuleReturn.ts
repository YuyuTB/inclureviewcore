import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

export class ColorContrastRuleReturn implements Issue {
  ruleId = "color_contrast";
  severity: Severity = "medium";
  message =
    "Element sets both color and backgroundColor inline. Contrast not checked.";
  fixSuggestion = "Ensure sufficient color contrast.";
  file: string;
  startLine: number;
  startColumn: number;
  endLine?: number;
  endColumn?: number;
  foregroundColor?: string;
  backgroundColor?: string;
  constructor(
    file: string,
    startLine: number,
    startColumn: number,
    endLine?: number,
    endColumn?: number,
    foregroundColor?: string,
    backgroundColor?: string,
  ) {
    this.file = file;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.endLine = endLine;
    this.endColumn = endColumn;
    this.foregroundColor = foregroundColor;
    this.backgroundColor = backgroundColor;
  }
}
