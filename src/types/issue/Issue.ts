import { Severity } from "./Severity.js";

export interface Issue {
  ruleId: string;
  severity: Severity;
  file: string;
  // Location info (start/end for blocks, single for single elements)
  startLine: number;
  startColumn: number;
  endLine?: number;
  endColumn?: number;
  message: string;
  fixSuggestion: string;
  // Special-case data for rules (optional)
  [key: string]: any;
}
