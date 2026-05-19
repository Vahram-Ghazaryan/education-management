import { Class, Teacher, Student, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  const { id } = req.query;
  const cls = await Class.findByPk(id, {
    include: [
      { model: Teacher, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] },
      { model: Student, as: 'students', attributes: ['id'] },
    ],
  });
  if (!cls) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'GET') return res.status(200).json(cls);
  if (req.method === 'PUT') {
    const { name, grade, section, teacherId } = req.body;
    await cls.update({ name, grade, section, teacherId: teacherId || null });
    return res.status(200).json(cls);
  }
  if (req.method === 'DELETE') {
    await cls.destroy();
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}

export default withAuth(handler);
