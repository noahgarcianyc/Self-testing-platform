import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "Problem", required: true },
    anonymousId: { type: String, default: "" },
    answer: { type: String, required: true },
    passed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Submission =
  mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
