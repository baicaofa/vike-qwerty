import type { IPerformanceEntry as ServerPerformanceEntry } from "../models/WordRecord";
import mongoose from "mongoose";

export function toDate(value: unknown): Date | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return isNaN(value.getTime()) ? undefined : value;
  const d = new Date(value as any);
  return isNaN(d.getTime()) ? undefined : d;
}

export function toMillis(value: unknown): number | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  const d = new Date(value as any);
  return isNaN(d.getTime()) ? undefined : d.getTime();
}

export function ensureObject<T extends object>(value: any, fallback: T): T {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as T;
  }
  return fallback;
}

export function generateEntryUuid(): string {
  return new mongoose.Types.ObjectId().toString();
}

export function mergePerformanceByEntryUuid(
  serverHistory: ServerPerformanceEntry[],
  clientHistory: ServerPerformanceEntry[]
): ServerPerformanceEntry[] {
  const map = new Map<string, ServerPerformanceEntry>();
  for (const entry of serverHistory) {
    map.set(entry.entryUuid, entry);
  }
  for (const entry of clientHistory) {
    const existing = map.get(entry.entryUuid);
    if (!existing) {
      map.set(entry.entryUuid, entry);
      continue;
    }
    // 同一 entryUuid，选择 timeStamp 更新的那个；相同则以客户端为准
    const existingMs = existing.timeStamp.getTime();
    const incomingMs = entry.timeStamp.getTime();
    if (incomingMs >= existingMs) {
      map.set(entry.entryUuid, entry);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => a.timeStamp.getTime() - b.timeStamp.getTime()
  );
}
