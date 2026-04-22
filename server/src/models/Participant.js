import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    solvedProblems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
    solvedByLevel: {
      type: Map,
      of: Number,
      default: () => new Map([["1", 0], ["2", 0], ["3", 0]]),
    },
  },
  { timestamps: true }
);

export const Participant =
  mongoose.models.Participant || mongoose.model("Participant", participantSchema);
