import { model, models, Schema } from "mongoose";

const notificationSchema = new Schema({
  id: { type: String, required: true, unique: true }, user_id: { type: String, required: true, index: true },
  title: { type: String, required: true }, message: { type: String, required: true }, type: { type: String, required: true },
  is_read: { type: Boolean, default: false }, created_at: { type: Date, default: Date.now },
}, { versionKey: false, collection: "notifications" });

export const NotificationModel = models.Notification || model("Notification", notificationSchema);
