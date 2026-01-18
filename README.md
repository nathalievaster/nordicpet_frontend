# NordicPet – Produkt- och lagerhanteringssystem

Detta projekt är en fullstack-webbapplikation utvecklad för att hantera produkter, lagersaldo och användarbehörigheter för ett företag. Applikationen består av en backend byggd med Node.js och Hapi samt en frontend utvecklad i Vue 3. Systemet stödjer autentisering, rollbaserad åtkomstkontroll, filuppladdning av produktbilder samt molnbaserad publicering.

## Funktionalitet

- Inloggning och registrering med JWT-baserad autentisering

- Rollbaserad åtkomst (admin och user)

- Skapa, redigera och ta bort produkter (admin)

- Visa produkter med tillhörande lagersaldo

- Justera lagersaldo i realtid

- Hantera produktkategorier (admin)

- Uppladdning och uppdatering av produktbilder

- Filtrering och paginering av produkter i frontend

## Teknikstack
### Backend

- Node.js

- Hapi

- Prisma ORM

- PostgreSQL (produktion)

- SQLite (utveckling)

- JWT för autentisering

- bcrypt för lösenordshantering

- Joi för validering

### Frontend

- Vue 3 (Composition API)

- Bootstrap

- Fetch API

- Netlify (deployment)

## Installation och körning lokalt
### Backend

Klona repot:

git clone https://github.com/nathalievaster/nordicpet_backend
cd nordicpet_backend


Installera beroenden:

npm install


Skapa .env och ange:

DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=adminpassword


Kör migrationer och seed:

npx prisma migrate dev
npm run seed


Starta servern:

npm run dev


Backend körs på http://localhost:3000.

### Frontend

Klona frontend-repot:

git clone https://github.com/nathalievaster/nordicpet_frontend
cd nordicpet_frontend


Installera beroenden:

npm install


Starta utvecklingsserver:

npm run dev


Frontend körs på http://localhost:5173.


## Säkerhet

- Lösenord hashas med bcrypt

- JWT används för autentisering

- Rollbaserad åtkomstkontroll

- Validering av indata med Joi

- Filuppladdning valideras via MIME-typ och filändelse