<div align="center">
  <h1 style="color: #8B5CF6;">☂️ education-management</h1>
  <p style="color: #A78BFA; font-size: 1.2rem;">Դպրոցի/Կրթական Հաստատության Կառավարման Համակարգ</p>
  <div>

[![Next.js](https://img.shields.io/badge/Next.js-8B5CF6?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/docs)
[![React](https://img.shields.io/badge/React-8B5CF6?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8B5CF6?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-8B5CF6?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/docs)
[![Sequelize](https://img.shields.io/badge/Sequelize-8B5CF6?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org)

  </div>
</div>

---

## ☂️ Նախագծի Մասին

Այս նախագիծը դինամիկ **Դպրոցի/Կրթական Հաստատության Կառավարման Համակարգ** է: Այն հնարավորություն է ընձեռում կենտրոնացված և արդյունավետ կերպով կառավարել ուսանողների, ուսուցիչների, դասարանների, առարկաների և գնահատականների տվյալները:

## ☂️ Հիմնական Հնարավորություններ

-  **Օգտատերերի և Տվյալների Կառավարում:** Ուսանողների, Ուսուցիչների, Դասարանների, Առարկաների և Գնահատականների ամբողջական կառավարում:
-  **Վիճակագրություն (Dashboard):** Տեսողական գրաֆիկներ և վիճակագրական տվյալներ Recharts-ի միջոցով:
-  **Ծանուցումների Համակարգ:** Ծանուցումների ստեղծում և իրական ժամանակում դիտում:
-  **Բազմալեզու Աջակցություն:** Համակարգը աշխատում է հայերեն և անգլերեն լեզուներով:

## ☂️ Տեխնոլոգիական Ստեկ

**Frontend:**
- `next`
- `react` / `react-dom`
- `tailwindcss` / `@tailwindcss/postcss` - ոճերի համար
- `framer-motion` - անիմացիաների համար
- `lucide-react` - նկարների համար
- `recharts` - գրաֆիկների համար
- `i18next` / `react-i18next` - բազմալեզու աջակցություն

**Backend & Database:**
- `next` API Routes
- `pg` / `pg-hstore` (PostgreSQL) - PostgreSQL տվյալների բազա
- `sequelize` / `sequelize-cli` - Sequelize ORM
- `jsonwebtoken` - JWT թոքեններ
- `bcryptjs` - գաղտնաբառերի գաղտնագրում
- `dotenv` - շրջակա միջավայրի փոփոխականներ

## ☂️ Պրոյեկտի Կառուցվածք

```text
education-management/
├── src/
│   ├── components/    # UI կոմպոնենտներ
│   ├── config/        # Կարգավորումներ և բազայի միացում
│   ├── context/       # React Context (AuthContext)
│   ├── lib/           # Օգնող ֆունկցիաներ
│   ├── locales/       # i18next թարգմանությունների ֆայլեր
│   ├── migrations/    # Տվյալների բազայի միգրացիաներ
│   ├── models/        # Sequelize մոդելներ
│   ├── pages/         # Next.js էջեր և API Routes (Backend)
│   ├── seeders/       # Նախնական տվյալների լցնում
│   └── styles/        # Գլոբալ ոճեր (Tailwind CSS)
├── .env.local         # Շրջակա միջավայրի փոփոխականներ
├── package.json       # Կախվածություններ և հրամաններ
└── README.md          # Նախագծի փաստաթղթավորում
```

## ☂️ Տեղադրում և Գործարկում

**1. Պատճենեք ռեպոզիտորիան (Clone repository)**
```bash
git clone https://github.com/Vahram-Ghazaryan/education-management.git
cd education-management
```

**2. Տեղադրեք կախվածությունները (Install dependencies)**
```bash
npm install
```

**3. Կարգավորեք շրջակա միջավայրի փոփոխականները**
Ստեղծեք `.env.local` ֆայլ արմատային պանակում և ավելացրեք հետևյալ տվյալները.
```env
DB_NAME=Ձեր Տվյալների Բազայի Անունը
DB_USER=Ձեր Օգտանունը
DB_PASSWORD=Ձեր Գաղտնաբառը
DB_HOST=Ձեր Տվյալների Բազայի Host-ը
DB_PORT=Ձեր Տվյալների Բազայի Port-ը
JWT_SECRET=Ձեր JWT Secret-ը
```

**4. Գործարկեք տվյալների բազայի միգրացիաները և seeder-ները**
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

**5. Գործարկեք նախագիծը**
Ըստ `package.json`-ում առկա հրամանների՝
- Մշակման միջավայրի համար (development)՝
```bash
npm run dev
```
- Արտադրական միջավայրի համար (production build and start)՝
```bash
npm run build
npm run start
```
- Կոդի ստուգման համար (lint)՝
```bash
npm run lint
```

Նախագիծը հասանելի կլինի `http://localhost:3000` հասցեով:

## ☂️ Անվտանգություն և Գաղտնիություն

- **Authentication:** Օգտատերերի մուտքը համակարգ վավերացվում է `jsonwebtoken` գրադարանի միջոցով: Հաջող մուտքի դեպքում ստեղծվում է JWT token, որն ապահովում է նույնականացումը:
- **Authorization:** Backend-ի API route-ները պաշտպանված են հատուկ middleware ֆունկցիաներով, որոնք ստուգում են ուղարկված token-ի վավերականությունը՝ թույլ չտալով չարտոնված մուտք:
- **Password Hashing:** Գաղտնաբառերը պահպանվում են PostgreSQL տվյալների բազայում գաղտնագրված (hashed) տարբերակով՝ օգտագործելով անվտանգ `bcryptjs` գրադարանը:

## ☂️ Պահանջներ

- **Node.js**
- **PostgreSQL** (կարգավորված փոփոխականներին համապատասխան)
- **npm** փաթեթների կառավարիչ
