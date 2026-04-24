import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

const missingImageAltSuggestion: string =
  'Add an alt attribute to your <img> describing its content or purpose. If the image is decorative, use alt="" or even better, role="presentation".';

export class MissingImageAltRuleReturn implements Issue {
  ruleId = "missing_image_alt";
  severity: Severity = "high";
  message = "Image is missing alt attribute";
  fixSuggestion = missingImageAltSuggestion;
  file: string;
  startLine: number;
  startColumn: number;
  endLine?: number;
  endColumn?: number;
  constructor(
    file: string,
    startLine: number,
    startColumn: number,
    endLine?: number,
    endColumn?: number,
  ) {
    this.file = file;
    this.startLine = startLine;
    this.startColumn = startColumn;
    this.endLine = endLine;
    this.endColumn = endColumn;
  }
}
