# CV ბილდერი

უფასო ვებ-ბილდერი: პროფესიონალური CV ქართულად ან ინგლისურად, რეგისტრაციის გარეშე.
აწყობილია PRD-ის („PRD: ინტერაქტიული CV ბილდერი“) MVP ფაზით და დიზაინის canvas-ით („CV ბილდერი — საიტის ვიზუალი“).

## გაშვება

```bash
npm install
cp .env.example .env.local   # ჩაწერე ANTHROPIC_API_KEY, რომ AI ჩაირთოს
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`.

AI გასაღების გარეშეც ყველაფერი მუშაობს. მხოლოდ „გააუმჯობესე AI-ით“ აჩვენებს შეტყობინებას „AI ჯერ არ არის ჩართული“.

## გვერდები

| მისამართი | რა არის |
|---|---|
| `/` | მთავარი გვერდი |
| `/start` | დაწყების მეთოდი, შაბლონი და CV-ის ენა |
| `/editor` | ფორმა (5 ნაბიჯი) + live preview + AI პანელი; მობილურზე „ფორმა / ნახვა“ ტაბები |
| `/export` | PDF, JSON სარეზერვო ასლი; DOCX და სახელიანი ლინკი „მალე“ |
| `POST /api/ai/improve` | AI-1: ტექსტის 1–3 ვარიანტი (სერვერზე, Claude API) |

## რა არის გაკეთებული (PRD → კოდი)

| PRD | სად |
|---|---|
| F-01 ინტერფეისის ენა ka/en | `lib/i18n.ts`, `components/ui.tsx` (`UiLangToggle`) |
| F-02 CV-ის ენა ცალკე, მონაცემები არ იკარგება | `cvStrings` in `lib/i18n.ts`, editor-ის „CV: ქარ / EN“ |
| F-03 12 შაბლონი | `components/CVDocument.tsx` (classic / modern / compact / elegant / minimal / bold / corporate / timeline / academic / creative / swiss / soft), მინიატურები — `TemplateThumb` in `components/ui.tsx`; რედაქტორში ვიზუალური არჩევა — `components/editor/TemplateDialog.tsx` |
| F-10 ეტაპობრივი ფორმა | `components/editor/Steps.tsx` |
| F-11 სექციების დამატება/წაშლა/გადაადგილება | `components/editor/SectionsDialog.tsx` (dnd-kit, კლავიატურითაც) |
| F-15 ავტოშენახვა ბრაუზერში | `lib/store.ts` + `lib/db.ts` (Zustand + Dexie/IndexedDB) |
| F-20 live preview | `components/ScaledPreview.tsx` |
| F-21 PDF = preview, ქართული შრიფტით | იგივე `CVDocument` იბეჭდება (`/export` → ბრაუზერის „Save as PDF“) |
| AI-1 ტექსტის გაუმჯობესება | `app/api/ai/improve/route.ts`, `components/editor/AIPanel.tsx` |
| JSON ექსპორტი/იმპორტი | `components/JsonBackup.tsx` |

AI-ის წესები: AI-ს მხოლოდ გასაუმჯობესებელი ტექსტი ეგზავნება (ელ-ფოსტა, ტელეფონი და ლინკები ჯერ იშლება), prompt-ი უკრძალავს ახალი ფაქტების დამატებას, ლიმიტი 20 მოთხოვნაა სესიაზე, ლოგებში ტექსტი არ იწერება.

## შემდეგი ნაბიჯები / შენიშვნები

- **PDF**: ახლა ბრაუზერის ბეჭდვით იქმნება (ტექსტური შრე და ჩაშენებული ქართული შრიფტი აქვს). PRD-ში რეკომენდებული სერვერული Playwright-ის ვარიანტი ერთი ღილაკით ჩამოტვირთვას მისცემს. იგივე `CVDocument` შეიძლება გამოვიყენოთ.
- **AI rate limit** მეხსიერებაშია (ერთ სერვერზე მუშაობს). რამდენიმე ინსტანსზე საჭიროა Redis/KV.
- **მოდელი**: ნაგულისხმევად `claude-opus-5-5`, დაბალი effort-ით. ფასის შესამცირებლად შეგიძლია `AI_MODEL` შეცვალო (მაგ. `claude-haiku-5-5`). Opus-ზე ჩართულია სერვერული fallback (`fallbacks: "default"`), რომ უარის შემთხვევაში მოთხოვნა სხვა მოდელზე გადავიდეს.
- P1/P2 (DOCX, ATS ქულა, ვაკანსიის ადაპტაცია, ფაილის/LinkedIn იმპორტი, სახელიანი ლინკი) ინტერფეისში „მალე“ ნიშნითაა.
- საიტის სახელი და დომენი ჯერ placeholder-ებია (`[საიტის სახელი დასაზუსტებელია]`, `[დომენი]/`).
