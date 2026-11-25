import { AppError } from "../../errors/AppError";
import { NotificationModel } from "./notification.model";

export async function listNotifications(userId: string) {
  return NotificationModel.find({ user_id: userId }).sort({ created_at: -1 }).limit(100).lean();
}

export async function markNotificationRead(userId: string, id: string) {
  const notification = await NotificationModel.findOneAndUpdate({ id, user_id: userId }, { $set: { is_read: true } }, { new: true });
  if (!notification) throw new AppError("Notification not found.", 404);
  return notification;
}
