// utils/annotations.ts
//
// Custom test-priority annotations. Playwright's TestInfo.annotations is
// the supported mechanism for attaching arbitrary metadata to a test run —
// it shows up in the HTML/JSON/JUnit reports, so priority is visible in
// every report format without inventing a parallel tagging system.
import { TestInfo } from '@playwright/test';

export type Priority = 'P0-Critical' | 'P1-High' | 'P2-Medium' | 'P3-Low';

export function setPriority(testInfo: TestInfo, priority: Priority) {
  testInfo.annotations.push({ type: 'priority', description: priority });
}

export function setKnownIssue(testInfo: TestInfo, issueRef: string) {
  testInfo.annotations.push({ type: 'known-issue', description: issueRef });
}
