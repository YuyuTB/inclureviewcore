import { Issue } from "../../types/issue/Issue.js";
import { Severity } from "../../types/issue/Severity.js";

const missingInputLabelSuggestion: string = `
    Add a <label> to your input with the 'for' attribute. \n
    You CAN additionnaly use aria-label/aria-labelledby if you have a good reason to not use a visible label. \n
    However, a visible label is best for accessibility and should be preferred whenever possible.
`;

export class MissingInputLabelRuleReturn implements Issue {
  ruleId = "missing_input_label";
  severity: Severity = "high";
  message = "Input is missing an associated label";
  fixSuggestion = missingInputLabelSuggestion;
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
