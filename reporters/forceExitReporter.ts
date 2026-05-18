import type { FullResult, Reporter } from '@playwright/test/reporter';

class ForceExitReporter implements Reporter {
  onEnd(result: FullResult): void {
    const exitCode = result.status === 'passed' ? 0 : 1;
    const timeoutMs = Number(process.env.PLAYWRIGHT_FORCE_EXIT_MS ?? 5000);

    setTimeout(() => {
      process.exit(exitCode);
    }, timeoutMs).unref();
  }
}

export default ForceExitReporter;
