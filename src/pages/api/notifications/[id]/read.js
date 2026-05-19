import { Notification } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let user;
  try {
    user = authMiddleware(req);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id } = req.query;

  try {
    const notification = await Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    return res.status(200).json(notification);
  } catch (error) {
    console.error('Error updating notification:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
