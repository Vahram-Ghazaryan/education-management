import { Subject, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  if (req.method === 'GET') {
    const subjects = await Subject.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json(subjects);
  }
  if (req.method === 'POST') {
    const { name, description, backgroundImage } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const subject = await Subject.create({ name, description, backgroundImage });
    return res.status(201).json(subject);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}

export default withAuth(handler);
