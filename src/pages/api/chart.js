import { Grade, Subject, syncDB } from '@/lib/db';
import { Op } from 'sequelize';
import { withAuth } from '@/lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  await syncDB();

  const { period = 'year' } = req.query;

  let startDate;
  const now = new Date();
  if (period === 'week') {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === 'month') {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (period === 'year') {
    startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
  }

  const whereClause = startDate ? {
    date: {
      [Op.gte]: startDate.toISOString().split('T')[0]
    }
  } : {};

  const grades = await Grade.findAll({
    where: whereClause,
    include: [{ model: Subject, as: 'subject', attributes: ['name'] }],
    order: [['date', 'ASC']]
  });


  const buckets = {};

  grades.forEach(g => {
    let bucketKey;

    if (period === 'week' || period === 'month') {

      bucketKey = g.date;
    } else {

      bucketKey = g.date.substring(0, 7);
    }

    if (!buckets[bucketKey]) buckets[bucketKey] = {};

    const subjName = g.subject?.name || 'Unknown';
    if (!buckets[bucketKey][subjName]) {
      buckets[bucketKey][subjName] = { totalScore: 0, totalMax: 0, count: 0 };
    }

    buckets[bucketKey][subjName].totalScore += parseFloat(g.score || 0);
    buckets[bucketKey][subjName].totalMax += parseFloat(g.maxScore || 100);
    buckets[bucketKey][subjName].count += 1;
  });

  const chartData = Object.keys(buckets).sort().map(bucketKey => {
    const dataPoint = { date: bucketKey };
    Object.keys(buckets[bucketKey]).forEach(subj => {
      const { totalScore, totalMax } = buckets[bucketKey][subj];
      dataPoint[subj] = parseFloat(((totalScore / totalMax) * 100).toFixed(1));
    });
    return dataPoint;
  });

  const allSubjects = await Subject.findAll({ attributes: ['name'] });
  const subjectsList = allSubjects.map(s => s.name);

  res.status(200).json({ chartData, subjectsList });
}

export default withAuth(handler);
