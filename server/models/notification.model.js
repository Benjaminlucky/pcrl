// models/notification.model.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["birthday_countdown", "birthday_reminder", "general"],
    required: true,
  },
  realtor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Realtor",
    required: true,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  daysBefore: {
    type: Number,
    required: true,
    min: 0,
    max: 7,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  metadata: {
    firstName: String,
    lastName: String,
    email: String,
  },
  channels: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for efficient queries
NotificationSchema.index({ type: 1, realtor: 1, targetDate: 1, daysBefore: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model("Notification", NotificationSchema);

// ### 3. **Restart your server**

// After making these changes, restart your server. You should see:
// ```;
// Connected to MongoDB
// { ping: 'pong' }
// Server is running
// 🎂 Running birthday checks...
// 📊 Checking birthdays for X realtors...
// ✅ Birthday checks completed
