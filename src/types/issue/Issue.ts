import { Severity } from "./Severity.js";

export interface Issue {
  ruleId: string;
  severity: Severity;
  file: string;
  line: number;
  message: string;
  fixSuggestion: string;
}
