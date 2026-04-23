import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

const missingImageAltSuggestion: string =
  'Add an alt attribute to your <img> describing its content or purpose. If the image is decorative, use alt="" or even better, role="presentation".';

export class MissingImageAltRuleReturn implements Issue {
  ruleId = "missing_image_alt";
  severity: Severity = "high";
  message = "Image is missing alt attribute";
  fixSuggestion = missingImageAltSuggestion;
  constructor(
    public file: string,
    public line: number,
  ) {}
}
