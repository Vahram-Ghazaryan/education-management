import { Teacher, Subject, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  const { id } = req.query;
  const teacher = await Teacher.findByPk(id, {
    include: [{ model: Subject, as: 'subject', attributes: ['id', 'name'] }],
  });
  if (!teacher) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'GET') return res.status(200).json(teacher);
  if (req.method === 'PUT') {
    const { firstName, lastName, email, phone, subjectId, gender } = req.body;
    if (!firstName || !lastName || !email || !gender)
      return res.status(400).json({ error: 'firstName, lastName, email, gender are required' });
    await teacher.update({ firstName, lastName, email, phone, subjectId: subjectId || null, gender });
    return res.status(200).json(teacher);
  }
  if (req.method === 'DELETE') {
    await teacher.destroy();
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}

export default withAuth(handler);
