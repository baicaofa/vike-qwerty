import { db } from ".";
import { getCurrentDate, recordDataAction } from "..";
import { generateUUID } from "../uuid";
import { triggerGlobalSync } from "@/services/syncService";

export type ExportProgress = {
  totalRows?: number;
  completedRows: number;
  done: boolean;
};

export type ImportProgress = {
  totalRows?: number;
  completedRows: number;
  done: boolean;
};

export async function exportDatabase(
  callback: (exportProgress: ExportProgress) => boolean
) {
  const [pako, { saveAs }] = await Promise.all([
    import("pako"),
    import("file-saver"),
    import("dexie-export-import"),
  ]);

  const blob = await db.export({
    progressCallback: ({ totalRows, completedRows, done }) => {
      return callback({ totalRows, completedRows, done });
    },
  });
  const [wordCount, chapterCount] = await Promise.all([
    db.wordRecords.count(),
    db.chapterRecords.count(),
  ]);

  const json = await blob.text();
  const compressed = pako.gzip(json);
  const compressedBlob = new Blob([compressed]);
  const currentDate = getCurrentDate();
  saveAs(compressedBlob, `keybr-Learner-User-Data-${currentDate}.gz`);
  recordDataAction({
    type: "export",
    size: compressedBlob.size,
    wordCount,
    chapterCount,
  });
}

export async function importDatabase(
  onStart: () => void,
  callback: (importProgress: ImportProgress) => boolean
) {
  const [pako] = await Promise.all([
    import("pako"),
    import("dexie-export-import"),
  ]);

  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/gzip";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;

    onStart();

    const compressed = await file.arrayBuffer();
    const json = pako.ungzip(compressed, { to: "string" });
    const blob = new Blob([json]);

    await db.import(blob, {
      acceptVersionDiff: true,
      acceptMissingTables: true,
      acceptNameDiff: false,
      acceptChangedPrimaryKey: false,
      overwriteValues: true,
      clearTablesBeforeImport: true,
      progressCallback: ({ totalRows, completedRows, done }) => {
        return callback({ totalRows, completedRows, done });
      },
    });

    // 导入后更新所有记录的sync_status和last_modified字段
    const now = Date.now();

    // 更新wordRecords
    await db.wordRecords.toCollection().modify((record) => {
      if (!record.uuid) record.uuid = generateUUID();
      if (!record.sync_status) record.sync_status = "local_new";
      // 修改下面这行
      if (!record.last_modified)
        record.last_modified =
          record.lastPracticedAt || record.firstSeenAt || now; // 或者根据业务逻辑选择更合适的字段
    });

    // 更新chapterRecords
    await db.chapterRecords.toCollection().modify((record) => {
      if (!record.uuid) record.uuid = generateUUID();
      if (!record.sync_status) record.sync_status = "local_new";
      if (!record.last_modified) record.last_modified = record.timeStamp || now;
    });

    // 更新reviewRecords
    await db.reviewRecords.toCollection().modify((record) => {
      if (!record.uuid) record.uuid = generateUUID();
      if (!record.sync_status) record.sync_status = "local_new";
      if (!record.last_modified)
        record.last_modified = record.createTime || now;
    });

    // 导入完成后触发同步
    await triggerGlobalSync();
  });

  input.click();
}
