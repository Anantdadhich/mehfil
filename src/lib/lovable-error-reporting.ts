export function reportLovableError(_error: unknown, _context: Record<string, unknown> = {}) {
  // Production no-op error handler to ensure zero third-party telemetry leakage
  return;
}
