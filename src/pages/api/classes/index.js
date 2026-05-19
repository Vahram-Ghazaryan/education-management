import { Class, Teacher, Student, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  if (req.method === 'GET') {
    const classes = await Class.findAll({
      include: [
        { model: Teacher, as: 'teacher', attributes: ['id', 'firstName', 'lastName'] },
        { model: Student, as: 'students', attributes: ['id'] },
      ],
      order: [['grade', 'ASC'], ['section', 'ASC']],
    });
    return res.status(200).json(classes);
  }
  if (req.method === 'POST') {
    const { name, grade, section, teacherId } = req.body;
    if (!name || !grade) return res.status(400).json({ error: 'name and grade are required' });
    const cls = await Class.create({ name, grade, section, teacherId: teacherId || null });
    return res.status(201).json(cls);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}

export default withAuth(handler);
