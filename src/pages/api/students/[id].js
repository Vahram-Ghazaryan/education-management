import { Student, Class, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  const { id } = req.query;
  const student = await Student.findByPk(id, {
    include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'grade', 'section'] }],
  });
  if (!student) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'GET') return res.status(200).json(student);
  if (req.method === 'PUT') {
    const { firstName, lastName, email, phone, birthDate, gender, classId } = req.body;
    if (!firstName || !lastName || !gender) return res.status(400).json({ error: 'firstName, lastName, gender are required' });
    await student.update({ firstName, lastName, email, phone, birthDate, gender, classId: classId || null });
    return res.status(200).json(student);
  }
  if (req.method === 'DELETE') {
    await student.destroy();
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}

export default withAuth(handler);
