import mongoose, { Schema } from "mongoose";

export interface IBlockedToken {
  token: string;
  tokenType: "access" | "refresh";
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  createdAt?: Date;
}

const blockedTokenSchema = new Schema<IBlockedToken>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tokenType: {
      type: String,
      enum: ["access", "refresh"],
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index to automatically delete expired tokens after they expire
blockedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const BlockedToken = mongoose.model<IBlockedToken>(
  "BlockedToken",
  blockedTokenSchema
);

export default BlockedToken;
