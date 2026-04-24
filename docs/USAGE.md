# IncluReview Core Usage Guide

IncluReview Core is a framework-agnostic, ESM-first accessibility analysis engine for static code analysis. It is designed to be embedded in CLI tools, CI pipelines, SaaS platforms, or editor plugins.

---

## 0. License and Permitted Use

IncluReview Core is licensed under the IncluReview Source Available License. By using this package, you agree to the following key terms (see [LICENSE](../LICENSE) for full details):

- **Permitted:**
  - Use for personal or internal organizational purposes (including commercial use)
  - Integrate into private CI/CD, developer tools, or internal dashboards
  - Extend with private plugins or rules
- **Not Permitted:**
  - Use in any hosted, managed, SaaS, or other application (including desktop, CLI, or mobile) that provides accessibility/code analysis to third parties (i.e., users outside your organization)
  - Use as the engine for a competing hosted/managed service or public-facing product
  - Expose as a public API, remote analysis engine, or any service for others outside your organization

Any violation of the license automatically terminates your rights to use the software.

See the [LICENSE](../LICENSE) file for the full legal text and clarifications.

---

## 1. Installation

Install IncluReview Core as a local dependency:

```
npm install @inclureview/core
```

Or, for local development:

```
npm install ../IncluReviewCore
```

---

## 2. Basic Usage

Import the analyzer and run it on a file:

```ts
import { analyze } from "@inclureview/core";

const filePath = "path/to/file.js";
const source = await fs.promises.readFile(filePath, "utf8");
const issues = analyze({
  filePath,
  source,
});
console.log(issues);
```

- `analyze` returns an array of issues, each with ruleId, severity, message, fixSuggestion, and precise location info.
- Supported file types: .js, .jsx, .ts, .tsx, .html, .vue, and Angular-style .ts with inline templates.

---

## 3. Integration Patterns

- **CLI Tool:** Use Node.js to read files, call `analyze`, and print or format results.
- **CI Pipeline:** Run the analyzer on changed files or PRs, fail builds on high-severity issues.
- **SaaS:** Accept file uploads or repo links, sanitize inputs, and call `analyze` on each file.
- **Editor Plugin:** Run `analyze` on open files and display issues as diagnostics or overlays.

---

## 4. Security & Best Practices

- The Core does not execute or eval user code—analysis is static and safe.
- Path validation, sandboxing, and resource limits are the responsibility of the consuming app.
- Keep dependencies up to date in your app for best security.

---

## 5. Advanced: Custom Rules (Coming Soon)

The Core is designed for future extensibility. Custom rule APIs will be documented in a future release.

---

## 6. Example: Batch Analysis

```ts
import { analyze } from "@inclureview/core";
import fs from "fs/promises";

const files = ["file1.js", "file2.html", "file3.vue"];
for (const filePath of files) {
  const source = await fs.readFile(filePath, "utf8");
  const issues = analyze({ filePath, source });
  console.log(filePath, issues);
}
```

---

## 7. Support

- For bugs or feature requests, open an issue on the repository.
- For integration help, see the README or contact the maintainers.

---

IncluReview Core is designed to be the foundation for robust, framework-agnostic accessibility tooling. Use it anywhere you need fast, reliable, and detailed static accessibility analysis.
