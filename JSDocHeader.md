# File Header Mandate: The Self-Documenting Codebase

Every `.ts` and `.tsx` file (excluding test files) must begin with the exact JSDoc header structure outlined below. You are responsible for ensuring its accuracy with every modification.

### Header Structure and Order

1.  **`@license` / Copyright:** Preserve any existing license, copyright, or SPDX lines if they are already present. These must remain at the top of the JSDoc block.
2.  **`@file`:** The full file path from the project root (e.g., `src/components/common/data-table.tsx`).
3.  **`@version`:** The file's semantic version.
4.  **`@description`:** A single, concise sentence explaining the file's primary responsibility.
5.  **`@module`:** The feature module to which the file belongs (e.g., `Chat`, `Portfolio`, `CoreUI`).
6.  **`@summary`:** A detailed paragraph that explains the file's architectural purpose, the problem it solves, and its role within the system. If you revise this section or the entire file, ensure the summary accurately reflects the complete role of the file.
7.  **`@dependencies`:** A list of key architectural dependencies (e.g., `react`, `zustand`, other major components).
8.  **`@outputs`:** A list of the key functionalities or data that this file exports.
9.  **`@changelog`:** A chronological list of significant changes. Each change should be on a new line, prefixed with the version and date (e.g., `- v0.2.0 (2025-08-08): Refactored X to improve performance.`).

### Semantic Versioning Guide

Semantic versioning helps convey the impact of changes to other developers.

*   **MAJOR (`X.y.z`):** For breaking changes, such as altering a component's props interface or a function's signature.
*   **MINOR (`x.Y.z`):** For new, non-breaking features, like adding a new function or an optional prop.
*   **PATCH (`x.y.Z`):** For non-breaking bug fixes or refactors, such as fixing a CSS class, improving performance, or updating documentation.
*   **New Files:** Should start at version `0.1.0`.

### Complete Example Structure

```tsx
/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * @file src/components/common/data-table.tsx
 * @version 1.2.0
 * @description A reusable and accessible component for displaying tabular data with sorting and filtering.
 *
 * @module CoreUI
 *
 * @summary This component abstracts the complexity of rendering, sorting, and filtering data sets. 
 * It is designed to be highly reusable across different features by accepting a data array and a 
 * column configuration object as props. It manages its own internal state for pagination and 
 * sorting, emitting events for parent components to handle data fetching, thus decoupling UI 
 * presentation from data logic.
 *
 * @dependencies
 * - react (useState, useMemo)
 * - clsx (for conditional classnames)
 * - @/lib/hooks/use-sorting
 * - ./table-header
 * - ./table-row
 *
 * @outputs
 * - Exports the `DataTable` React component.
 * - Exports the `DataTableProps` TypeScript type.
 *
 * @changelog
 * - v1.2.0 (2025-09-15): Added client-side filtering functionality.
 * - v1.1.1 (2025-09-12): Fixed an accessibility issue with screen reader labels.
 * - v1.0.0 (2025-09-10): Implemented column sorting.
 * - v0.1.0 (2025-09-01): Initial release of the component.
 */
```