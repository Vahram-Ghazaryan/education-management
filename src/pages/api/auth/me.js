import { User, syncDB } from '@/lib/db';
import { authMiddleware } from '@/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const decoded = authMiddleware(req);
    await syncDB();

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
