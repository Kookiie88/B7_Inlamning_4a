import mongoose from "mongoose";

const screeningSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  attributes: {
    movieID: { type: Number, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
  },
});

export default mongoose.models.Screening || mongoose.model("Screening", screeningSchema);
