import { Notification } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  let user;
  try {
    user = authMiddleware(req);
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Notification.findAndCountAll({
      where: {
        userId: null 
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      notifications: rows,
      totalPages,
      currentPage: page,
      totalItems: count
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
