import { Student, Class, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  if (req.method === 'GET') {
    const students = await Student.findAll({
      include: [{ model: Class, as: 'class', attributes: ['id', 'name', 'grade', 'section'] }],
      order: [['lastName', 'ASC']],
    });
    return res.status(200).json(students);
  }
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, birthDate, gender, classId } = req.body;
    if (!firstName || !lastName || !gender) return res.status(400).json({ error: 'firstName, lastName, gender are required' });
    const student = await Student.create({
      firstName, lastName, email, phone, birthDate, gender, classId: classId || null,
    });
    return res.status(201).json(student);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}

export default withAuth(handler);
