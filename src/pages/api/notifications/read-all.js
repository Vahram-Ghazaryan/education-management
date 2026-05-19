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

  try {
    await Notification.update(
      { isRead: true },
      { where: { isRead: false } }
    );

    return res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
