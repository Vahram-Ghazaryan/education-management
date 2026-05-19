import { Grade, Student, Subject, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  await syncDB();
  const { id } = req.query;
  const grade = await Grade.findByPk(id, {
    include: [
      { model: Student, as: 'student', attributes: ['id', 'firstName', 'lastName'] },
      { model: Subject, as: 'subject', attributes: ['id', 'name'] },
    ],
  });
  if (!grade) return res.status(404).json({ error: 'Not found' });

  if (req.method === 'GET') return res.status(200).json(grade);
  if (req.method === 'PUT') {
    const { studentId, subjectId, score, maxScore, date, notes } = req.body;
    await grade.update({ studentId, subjectId, score, maxScore, date, notes });
    return res.status(200).json(grade);
  }
  if (req.method === 'DELETE') {
    await grade.destroy();
    return res.status(204).end();
  }
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  res.status(405).end();
}

export default withAuth(handler);
