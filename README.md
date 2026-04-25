# IncluReview Core (@inclureview/core)

![License](https://img.shields.io/badge/license-source--available-orange)
![Status](https://img.shields.io/badge/status-active-green)

IncluReview Core: AST-based accessibility analysis engine for frontend code.

## License

IncluReview Core is source-available software.

It is free for internal use and self-hosting, but may not be used to create a competing hosted service.

## Usage

Install locally in your project:

```
npm install @inclureview/core
```

Import and use:

```ts
import { analyze } from "@inclureview/core";
```

## Security Notes

- The Core package does not enforce any directory or path restrictions. If you are building an APP using this package, you are responsible for validating and sanitizing file paths as appropriate for your use case.

## Documentation

- See [docs/USAGE.md](docs/USAGE.md) for a complete guide on integrating IncluReview Core into your app, including installation, usage, and best practices.
