import { headers } from "next/headers";

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  os?: string;
}

function identifyBrowser(userAgent: string) {
  if (/Edg\//i.test(userAgent)) return "Edge";
  if (/Chrome\//i.test(userAgent)) return "Chrome";
  if (/Firefox\//i.test(userAgent)) return "Firefox";
  if (/Safari\//i.test(userAgent) && !/Chrome\//i.test(userAgent))
    return "Safari";
  return "Outro";
}

function identifyOs(userAgent: string) {
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Android/i.test(userAgent)) return "Android";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Mac OS X/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "Outro";
}

export async function getRequestContext(): Promise<RequestContext> {
  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? undefined;
  const forwardedFor = requestHeaders.get("x-forwarded-for");

  return {
    ipAddress:
      forwardedFor?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      undefined,
    userAgent,
    browser: userAgent ? identifyBrowser(userAgent) : undefined,
    os: userAgent ? identifyOs(userAgent) : undefined,
  };
}
