import { Grade, Student, Subject, syncDB } from '@/lib/db';
import { withAuth } from '@/lib/auth';
import { Op, Sequelize } from 'sequelize';

async function handler(req, res) {
  await syncDB();
  if (req.method === 'GET') {
    const { page = 1, limit = 8, search = '', subjectId = '', performance = '' } = req.query;

    const limitNum = parseInt(limit, 10);
    const offsetNum = (parseInt(page, 10) - 1) * limitNum;

    const where = {};
    if (subjectId) {
      where.subjectId = subjectId;
    }

    if (performance) {
      if (performance === 'excellent') {
        where[Op.and] = [Sequelize.literal('score / "maxScore" >= 0.9')];
      } else if (performance === 'good') {
        where[Op.and] = [Sequelize.literal('score / "maxScore" >= 0.75 AND score / "maxScore" < 0.9')];
      } else if (performance === 'pass') {
        where[Op.and] = [Sequelize.literal('score / "maxScore" >= 0.6 AND score / "maxScore" < 0.75')];
      } else if (performance === 'fail') {
        where[Op.and] = [Sequelize.literal('score / "maxScore" < 0.6')];
      }
    }

    const include = [
      { model: Student, as: 'student', attributes: ['id', 'firstName', 'lastName'] },
      { model: Subject, as: 'subject', attributes: ['id', 'name'] },
    ];

    if (search) {
      where[Op.or] = [
        { '$student.firstName$': { [Op.iLike]: `%${search}%` } },
        { '$student.lastName$': { [Op.iLike]: `%${search}%` } },
        { '$subject.name$': { [Op.iLike]: `%${search}%` } },
      ];
    }

    const result = await Grade.findAndCountAll({
      where,
      include,
      limit: limitNum,
      offset: offsetNum,
      order: [['date', 'DESC']],
    });

    return res.status(200).json({ grades: result.rows, total: result.count });
  }
  if (req.method === 'POST') {
    const { studentId, subjectId, score, maxScore, date, notes } = req.body;
    if (!studentId || !subjectId || score == null || !date)
      return res.status(400).json({ error: 'studentId, subjectId, score, date are required' });
    const grade = await Grade.create({ studentId, subjectId, score, maxScore: maxScore || 100, date, notes });
    return res.status(201).json(grade);
  }
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end();
}

export default withAuth(handler);
