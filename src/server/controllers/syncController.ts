import ChapterRecord from "../models/ChapterRecord";
import ReviewRecord from "../models/ReviewRecord";
import WordRecord from "../models/WordRecord";
import { Request, Response } from "express";
import mongoose from "mongoose";

// Define types for sync request and response
interface SyncChange {
  table: "wordRecords" | "chapterRecords" | "reviewRecords";
  action: "create" | "update" | "delete";
  data: any;
}

interface SyncRequest {
  lastSyncTimestamp: string;
  changes: SyncChange[];
}

interface SyncResponse {
  newSyncTimestamp: string;
  serverChanges: SyncChange[];
}

// Helper function to get the appropriate model based on table name
const getModel = (table: string) => {
  switch (table) {
    case "wordRecords":
      return WordRecord;
    case "chapterRecords":
      return ChapterRecord;
    case "reviewRecords":
      return ReviewRecord;
    default:
      throw new Error(`Unknown table: ${table}`);
  }
};

// Helper function to format a record for sync response
const formatRecordForSync = (record: any, table: string): SyncChange => {
  return {
    table: table as "wordRecords" | "chapterRecords" | "reviewRecords",
    action: record.isDeleted ? "delete" : "update",
    data: record.toObject(),
  };
};

export const syncData = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { lastSyncTimestamp, changes } = req.body as SyncRequest;
    const userId = req.user._id;
    const newSyncTimestamp = new Date().toISOString();
    const serverChanges: SyncChange[] = [];

    // Process client changes
    for (const change of changes) {
      const { table, action, data } = change;
      const Model = getModel(table);

      if (action === "create") {
        // Create new record
        const newRecord = new Model({
          ...data,
          userId,
          serverModifiedAt: new Date(),
        });
        await newRecord.save({ session });
      } else if (action === "update") {
        // Find existing record
        const existingRecord = await Model.findOne({
          uuid: data.uuid,
          userId,
        }).session(session);

        if (existingRecord) {
          // Apply "last write wins" rule based on client_modified_at
          if (
            new Date(data.clientModifiedAt) > existingRecord.clientModifiedAt
          ) {
            // Update record
            Object.assign(existingRecord, {
              ...data,
              serverModifiedAt: new Date(),
            });
            await existingRecord.save({ session });
          }
        } else {
          // Record doesn't exist, create it
          const newRecord = new Model({
            ...data,
            userId,
            serverModifiedAt: new Date(),
          });
          await newRecord.save({ session });
        }
      } else if (action === "delete") {
        // Find and soft delete record
        const record = await Model.findOne({ uuid: data.uuid, userId }).session(
          session
        );

        if (record) {
          record.isDeleted = true;
          record.clientModifiedAt = new Date(data.clientModifiedAt);
          record.serverModifiedAt = new Date();
          await record.save({ session });
        }
      }
    }

    // Query server changes since last sync
    const lastSyncDate = new Date(lastSyncTimestamp);

    // Query changes from each table
    const tables = ["wordRecords", "chapterRecords", "reviewRecords"];

    for (const table of tables) {
      const Model = getModel(table);
      const records = await Model.find({
        userId,
        updatedAt: { $gt: lastSyncDate },
      }).session(session);

      // Add records to server changes
      for (const record of records) {
        serverChanges.push(formatRecordForSync(record, table));
      }
    }

    // Commit transaction
    await session.commitTransaction();

    // Send response
    const response: SyncResponse = {
      newSyncTimestamp,
      serverChanges,
    };

    res.status(200).json(response);
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();

    console.error("Sync error:", error);
    res
      .status(500)
      .json({ message: "同步失败", error: (error as Error).message });
  } finally {
    session.endSession();
  }
};
