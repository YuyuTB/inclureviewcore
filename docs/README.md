# IncluReviewCore Documentation

IncluReviewCore is the modular accessibility analysis engine powering IncluReviewApp and other integrations.

## Architecture & Engineering

- **Core Engine:** AST parsing, rule evaluation, issue generation
- **Rule System:**
  - Each rule is a pure function: `(path, file) => Issue | null`
  - Rules are deterministic, unit-testable, and independent
  - All rules return a class implementing the `Issue` interface (see types/issue/)
- **Testing:** 100% unit test coverage for all rules; TDD enforced for rule logic
- **Extensibility:** Add new rules in `rules/`, new return types in `models/ruleReturn/`

## Constraints & Principles

- All analysis is AST-based (no regex)
- Framework-agnostic at the core level
- Output is always structured and actionable

## Developer Notes

- See `/ai/context/fixed/core/` and `/ai/context/generated/core/` in the app for all requirements, constraints, and architecture context
- See `/docs` in the app for product/integration documentation

---
