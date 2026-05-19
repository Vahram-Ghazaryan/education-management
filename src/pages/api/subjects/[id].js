import { Subject, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  const { id } = req.query;
  const subject = await Subject.findByPk(id);
  if (!subject) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'GET') return res.status(200).json(subject);
  if (req.method === 'PUT') {
    const { name, description, backgroundImage } = req.body;
    await subject.update({ name, description, backgroundImage });
    return res.status(200).json(subject);
  }
  if (req.method === 'DELETE') {
    await subject.destroy();
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}

export default withAuth(handler);
