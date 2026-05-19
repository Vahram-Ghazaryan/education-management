import { Teacher, Subject, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  if (req.method === 'GET') {
    const teachers = await Teacher.findAll({
      include: [{ model: Subject, as: 'subject', attributes: ['id', 'name'] }],
      order: [['lastName', 'ASC']],
    });
    return res.status(200).json(teachers);
  }
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, subjectId, gender } = req.body;
    if (!firstName || !lastName || !email || !gender)
      return res.status(400).json({ error: 'firstName, lastName, email, gender are required' });
    const teacher = await Teacher.create({ firstName, lastName, email, phone, subjectId: subjectId || null, gender });
    return res.status(201).json(teacher);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}

export default withAuth(handler);
