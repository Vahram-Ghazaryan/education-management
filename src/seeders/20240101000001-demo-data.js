'use strict';

const now = new Date();

module.exports = {
  async up(queryInterface, Sequelize) {

    const subjectsData = [
      {
        name: 'Հայոց լեզու',
        description: 'Հայ գրականություն, քերականություն և ուղղագրություն',
        backgroundImage: '/images/subjects/humanities.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Մաթեմատիկա',
        description: 'Հանրահաշիվ, երկրաչափություն և թվային անալիզ',
        backgroundImage: '/images/subjects/math.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Ֆիզիկա',
        description: 'Մեխանիկա, ջերմաֆիզիկա, օպտիկա և էլեկտրոդինամիկա',
        backgroundImage: '/images/subjects/physics.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Քիմիա',
        description: 'Անօրգանական և օրգանական քիմիա',
        backgroundImage: '/images/subjects/chemistry.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Կենսաբանություն',
        description: 'Բջջաբանություն, գենետիկա, էկոլոգիա',
        backgroundImage: '/images/subjects/biology.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Պատմություն',
        description: 'Հայոց պատմություն և համաշխարհային պատմություն',
        backgroundImage: '/images/subjects/history.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Աշխարհագրություն',
        description: 'Ֆիզիկական և տնտեսական աշխարհագրություն',
        backgroundImage: '/images/subjects/geography.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Անգլերեն',
        description: 'Անգլիական լեզու և գրականություն',
        backgroundImage: '/images/subjects/english.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Ինֆորմատիկա',
        description: 'Ծրագրավորում, ալգորիթմներ, տվյալների կառուցվածք',
        backgroundImage: '/images/subjects/it.png',
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Ֆիզկուլտուրա',
        description: 'Մարզական պարապմունքներ և ֆիզիկական զարգացում',
        backgroundImage: '/images/subjects/pe.png',
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert('subjects', subjectsData);

    const subjects = await queryInterface.sequelize.query(
      `SELECT id, name FROM subjects ORDER BY id`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const S = {};
    subjects.forEach((s) => {
      S[s.name.trim().normalize()] = s.id;
    });


    await queryInterface.bulkInsert('teachers', [
      {
        firstName: 'Անի',
        lastName: 'Հովհաննիսյան',
        email: 'ani.hovhannisyan@school.am',
        phone: '+374 91 111 001',
        gender: 'female',
        subjectId: S['Հայոց լեզու'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Գրիգոր',
        lastName: 'Սահակյան',
        email: 'grigor.sahakyan@school.am',
        phone: '+374 91 111 002',
        gender: 'male',
        subjectId: S['Մաթեմատիկա'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Մարիամ',
        lastName: 'Կարապետյան',
        email: 'mariam.karapetyan@school.am',
        phone: '+374 91 111 003',
        gender: 'female',
        subjectId: S['Ֆիզիկա'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Անի',
        lastName: 'Պետրոսյան',
        email: 'ani.petrosyan@school.am',
        phone: '+374 91 111 004',
        gender: 'female',
        subjectId: S['Քիմիա'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Նարե',
        lastName: 'Մկրտչյան',
        email: 'nare.mkrtchyan@school.am',
        phone: '+374 91 111 005',
        gender: 'female',
        subjectId: S['Կենսաբանություն'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Սարգիս',
        lastName: 'Հարությունյան',
        email: 'sargis.harutyunyan@school.am',
        phone: '+374 91 111 006',
        gender: 'male',
        subjectId: S['Պատմություն'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Լիլիթ',
        lastName: 'Դավթյան',
        email: 'lilit.davtyan@school.am',
        phone: '+374 91 111 007',
        gender: 'female',
        subjectId: S['Աշխարհագրություն'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Աշոտ',
        lastName: 'Ղազարյան',
        email: 'ashot.ghazaryan@school.am',
        phone: '+374 91 111 008',
        gender: 'male',
        subjectId: S['Անգլերեն'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Կարեն',
        lastName: 'Վարդանյան',
        email: 'karen.vardanyan@school.am',
        phone: '+374 91 111 009',
        gender: 'male',
        subjectId: S['Ինֆորմատիկա'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Արամ',
        lastName: 'Սարգսյան',
        email: 'aram.sargsyan@school.am',
        phone: '+374 91 111 010',
        gender: 'male',
        subjectId: S['Ֆիզկուլտուրա'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Աննա',
        lastName: 'Գևորգյան',
        email: 'anna.gevorgyan@school.am',
        phone: '+374 91 111 011',
        gender: 'female',
        subjectId: S['Անգլերեն'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Տիգրան',
        lastName: 'Մելիքյան',
        email: 'tigran.melikyan@school.am',
        phone: '+374 91 111 012',
        gender: 'male',
        subjectId: S['Մաթեմատիկա'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Աննա',
        lastName: 'Աբրահամյան',
        email: 'anna.abrahamyan@school.am',
        phone: '+374 91 111 013',
        gender: 'female',
        subjectId: S['Հայոց լեզու'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Արմեն',
        lastName: 'Գրիգորյան',
        email: 'armen.grigoryan@school.am',
        phone: '+374 91 111 014',
        gender: 'male',
        subjectId: S['Ֆիզիկա'.normalize()],
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const teachers = await queryInterface.sequelize.query(
      `SELECT id, email FROM teachers ORDER BY id`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const T = Object.fromEntries(teachers.map((t) => [t.email, t.id]));


    await queryInterface.bulkInsert('classes', [
      {
        name: '9Ա',
        grade: 9,
        section: 'Ա',
        teacherId: T['ani.hovhannisyan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: '9Բ',
        grade: 9,
        section: 'Բ',
        teacherId: T['grigor.sahakyan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: '10Ա',
        grade: 10,
        section: 'Ա',
        teacherId: T['mariam.karapetyan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: '10Բ',
        grade: 10,
        section: 'Բ',
        teacherId: T['lilit.davtyan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: '11Ա',
        grade: 11,
        section: 'Ա',
        teacherId: T['sargis.harutyunyan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: '11Բ',
        grade: 11,
        section: 'Բ',
        teacherId: T['ashot.ghazaryan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: '12Ա',
        grade: 12,
        section: 'Ա',
        teacherId: T['karen.vardanyan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
      {
        name: '12Բ',
        grade: 12,
        section: 'Բ',
        teacherId: T['shushanik.gevorgyan@school.am'],
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const classes = await queryInterface.sequelize.query(
      `SELECT id, name FROM classes ORDER BY id`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const C = Object.fromEntries(classes.map((c) => [c.name, c.id]));


    await queryInterface.bulkInsert('students', [
      {
        firstName: 'Արման',
        lastName: 'Հարությունյան',
        email: 'arman.harutyunyan@student.am',
        phone: '+374 93 201 001',
        birthDate: '2009-03-14',
        gender: 'male',
        classId: C['9Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Սոնյա',
        lastName: 'Հարությունյան',
        email: 'sonya.harutyunyan@student.am',
        phone: '+374 93 201 002',
        birthDate: '2009-07-22',
        gender: 'female',
        classId: C['9Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Նարեկ',
        lastName: 'Գրիգորյան',
        email: 'narek.grigoryan@student.am',
        phone: '+374 93 201 003',
        birthDate: '2009-05-18',
        gender: 'male',
        classId: C['9Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Մանե',
        lastName: 'Գևորգյան',
        email: 'mane.gevorgyan@student.am',
        phone: '+374 93 201 004',
        birthDate: '2009-12-05',
        gender: 'female',
        classId: C['9Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Գոռ',
        lastName: 'Սարգսյան',
        email: 'gor.sargsyan@student.am',
        phone: '+374 93 201 005',
        birthDate: '2009-08-30',
        gender: 'male',
        classId: C['9Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Էլեն',
        lastName: 'Կարապետյան',
        email: 'elen.karapetyan@student.am',
        phone: '+374 93 201 006',
        birthDate: '2009-10-14',
        gender: 'female',
        classId: C['9Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Դավիթ',
        lastName: 'Սահակյան',
        email: 'davit.sahakyan@student.am',
        phone: '+374 93 201 007',
        birthDate: '2009-02-28',
        gender: 'male',
        classId: C['9Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Անի',
        lastName: 'Աբրահամյան',
        email: 'ani.abrahamyan@student.am',
        phone: '+374 93 201 008',
        birthDate: '2009-09-12',
        gender: 'female',
        classId: C['9Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Հայկ',
        lastName: 'Պետրոսյան',
        email: 'hayk.petrosyan@student.am',
        phone: '+374 93 201 009',
        birthDate: '2008-04-10',
        gender: 'male',
        classId: C['10Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Մերի',
        lastName: 'Մկրտչյան',
        email: 'mary.mkrtchyan@student.am',
        phone: '+374 93 201 010',
        birthDate: '2008-11-20',
        gender: 'female',
        classId: C['10Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Կարեն',
        lastName: 'Դավթյան',
        email: 'karen.davtyan@student.am',
        phone: '+374 93 201 011',
        birthDate: '2008-01-25',
        gender: 'male',
        classId: C['10Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Տաթև',
        lastName: 'Հովհաննիսյան',
        email: 'tatev.hovhannisyan@student.am',
        phone: '+374 93 201 012',
        birthDate: '2008-06-30',
        gender: 'female',
        classId: C['10Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Սամվել',
        lastName: 'Մելիքյան',
        email: 'samvel.melikyan@student.am',
        phone: '+374 93 201 013',
        birthDate: '2008-08-15',
        gender: 'male',
        classId: C['10Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Լիլի',
        lastName: 'Վարդանյան',
        email: 'lily.vardanyan@student.am',
        phone: '+374 93 201 014',
        birthDate: '2008-03-05',
        gender: 'female',
        classId: C['10Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Գրիգոր',
        lastName: 'Ղազարյան',
        email: 'grigor.ghazaryan@student.am',
        phone: '+374 93 201 015',
        birthDate: '2007-09-09',
        gender: 'male',
        classId: C['11Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Անի',
        lastName: 'Սարգսյան',
        email: 'ani.sargsyan@student.am',
        phone: '+374 93 201 016',
        birthDate: '2007-12-14',
        gender: 'female',
        classId: C['11Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Արամ',
        lastName: 'Հարությունյան',
        email: 'aram.harutyunyan2@student.am',
        phone: '+374 93 201 017',
        birthDate: '2007-06-25',
        gender: 'male',
        classId: C['11Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Աննա',
        lastName: 'Կիրակոսյան',
        email: 'anna.kirakosyan@student.am',
        phone: '+374 93 201 018',
        birthDate: '2007-02-11',
        gender: 'female',
        classId: C['11Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Ռոբերտ',
        lastName: 'Ասատրյան',
        email: 'robert.asatryan@student.am',
        phone: '+374 93 201 019',
        birthDate: '2006-10-02',
        gender: 'male',
        classId: C['12Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Գայանե',
        lastName: 'Աբրահամյան',
        email: 'gayane.abrahamyan@student.am',
        phone: '+374 93 201 020',
        birthDate: '2006-04-20',
        gender: 'female',
        classId: C['12Ա'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Արթուր',
        lastName: 'Մանուկյան',
        email: 'arthur.manukyan@student.am',
        phone: '+374 93 201 021',
        birthDate: '2006-07-15',
        gender: 'male',
        classId: C['12Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Սյուզաննա',
        lastName: 'Մարգարյան',
        email: 'syuzanna.margaryan@student.am',
        phone: '+374 93 201 022',
        birthDate: '2006-11-12',
        gender: 'female',
        classId: C['12Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Տիգրան',
        lastName: 'Մինասյան',
        email: 'tigran.minasyan@student.am',
        phone: '+374 93 201 023',
        birthDate: '2006-08-08',
        gender: 'male',
        classId: C['12Բ'],
        createdAt: now,
        updatedAt: now,
      },
      {
        firstName: 'Լուսինե',
        lastName: 'Բաբայան',
        email: 'lusine.babayan@student.am',
        phone: '+374 93 201 024',
        birthDate: '2006-12-25',
        gender: 'female',
        classId: C['12Բ'],
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const students = await queryInterface.sequelize.query(
      `SELECT id, email FROM students ORDER BY id`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const ST = Object.fromEntries(students.map((s) => [s.email, s.id]));


    const gradesData = [];
    const oneDayMs = 24 * 60 * 60 * 1000;
    const today = new Date();

    const studentIds = Object.values(ST);
    const subjectIds = Object.values(S);


    const subjectBaseScores = {};
    Object.keys(S).forEach((subjectName, idx) => {
      subjectBaseScores[S[subjectName]] = ((60 + (idx * 3)) % 100) + 1;
    });

    for (let i = 0; i < 730; i += 7) {
      const currentDate = new Date(today.getTime() - (i * oneDayMs));
      const dateStr = currentDate.toISOString().split('T')[0];


      subjectIds.forEach((subjectId) => {
        const studentId = studentIds[Math.floor(Math.random() * studentIds.length)];


        let baseScore = subjectBaseScores[subjectId];
        let trend = (730 - i) / 40;
        let noise = Math.floor(Math.random() * 15) - 7;

        let score = Math.floor(baseScore + trend + noise);
        if (score > 100) score = 100;
        if (score < 0) score = 0;

        gradesData.push({
          studentId,
          subjectId,
          score,
          maxScore: 100,
          date: dateStr,
          notes: null,
          createdAt: now,
          updatedAt: now,
        });
      });
    }

    await queryInterface.bulkInsert('grades', gradesData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {
      truncate: true,
      cascade: true,
    });

    await queryInterface.bulkDelete('students', null, {
      truncate: true,
      cascade: true,
    });

    await queryInterface.bulkDelete('classes', null, {
      truncate: true,
      cascade: true,
    });

    await queryInterface.bulkDelete('teachers', null, {
      truncate: true,
      cascade: true,
    });

    await queryInterface.bulkDelete('subjects', null, {
      truncate: true,
      cascade: true,
    });
  },
};