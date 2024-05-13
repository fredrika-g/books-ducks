### Individuellt projektarbete - Book Ducks

Du har fått i uppdrag att ta fram en applikation för bokaffären Book Ducks, där de kan ladda upp böcker som de säljer. Användare ska också kunna logga in, betygsätta samt spara böcker.

Admin ska kunna ladda upp böcker via admin-gränssnittet.
Varje bok ska ha en titel, författare, antal sidor, utgivningsdatum samt en bild på bokomslaget.
(VG) Varje bok ska även innehålla ett snittbetyg (skala t.ex 1-10). Betyget är snittvärde av varje användares betyg (se nedan).
Ladda upp minst 10 böcker i CMSet.
Admin ska med hjälp av admin-gränssnittet kunna välja mellan minst tre olika färgteman på webbplatsen.

## Utloggat läge

Det ska finnas möjlighet för användare att registrera sig samt logga in.
Användare ser samtliga böcker med all tillhörande information som finns i API:et.

## Inloggat läge

Det ska tydligt framgå vem som är inloggad på sidan. Användare ska kunna logga ut.
Användare ska kunna spara böcker i en personlig “Att läsa”-lista.
Användaren ska även ha en profilsida. På denna sida ska användaren kunna se sin “Att läsa”-lista med samtliga sparade böcker. Listan ska kunna sorteras på titel samt författare (bokstavsordning). Användare ska även kunna ta bort böcker från denna lista.

(VG) Användaren ska kunna betygsätta böcker. När en användare betygsätter en bok ska bokens snittbetyg uppdateras.
Admin ska med hjälp av admin-gränssnittet kunna välja mellan minst tre olika färgteman på webbplatsen.
(VG) - Profilsidan ska även innehålla en lista över samtliga böcker som användaren betygsatt. Dessa ska kunna sorteras på titel, författare samt betyg som användaren gett boken (titel och författare sorteras i bokstavsordning A-Ö, betyg från högst till lägst).

Sidan ska ha ett (någorlunda) professionellt utseende.
Sidan ska fungera utan några större buggar.
Individuell rapport ska även lämnas in.

## Instruktioner för inlämning

Inlämningen ska ske i form av en zip-fil eller en publik github-länk.

Github

Navigera till er Strapi-mapp (t.ex backend).
Öppna upp filen git-ignore och under kommentaren “Logs and databases”, ta bort raden “.tmp”. Detta kommer göra att ni även laddar upp era böcker som ni skapat.
Öppna upp terminalen och skriv kommandot “rm -rf .git” för att ta bort github-repot som skapas upp automatiskt.
Starta sedan ett nytt repository i er projektmapp (som innehåller både frontend och backend). Ladda upp repository till Github.

.Zip-fil

Ta bort node_modules-mappen.
Komprimera till en zip-fil och döp projektet till CMS_Projekt_förnamn_efternamn.zip.

Inlämning senast 22/5 23.59
