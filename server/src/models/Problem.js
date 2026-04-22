import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    level: { type: Number, enum: [1, 2, 3], required: true, index: true },
    order: { type: Number, required: true, min: 1, max: 20 },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    type: { type: String, enum: ["shortText", "codeSnippet"], required: true },
    correctAnswer: { type: String, required: true },
    starterCode: { type: String, default: "" },
    tags: [{ type: String }],
    hints: [{ type: String }],
  },
  { timestamps: true }
);

problemSchema.index({ level: 1, order: 1 }, { unique: true });

export const Problem = mongoose.models.Problem || mongoose.model("Problem", problemSchema);

export const problemPublicProjection = {
  correctAnswer: 0,
};
