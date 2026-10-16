# Ali Marketi

Sajt za alimarketi.ba. Jezik sučelja je bosanski. Podaci su uzorak u `/data`, spremni da kasnije pređu u CMS.

## Pokretanje

```bash
npm install
npm run dev
```

Otvori [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
npm run lint
```

## Gdje se mijenja sadržaj

| Šta | Fajl |
| --- | --- |
| Poslovnice, adrese, sati, koordinate | `data/stores.ts` |
| Akcije i cijene | `data/deals.ts` |
| Oglasi za posao | `data/jobs.ts` |
| Letci i arhiva | `data/flyers.ts` |
| Telefon, e-pošta, društvene mreže | `data/site.ts` |

Kad prave cijene uđu u `data/deals.ts`, stavi `showSampleNotice: false` u `data/site.ts`.

Lista za kupovinu je u `localStorage` (`alimarketi-lista`). Viber dijeli tekst preko `viber://forward?text=...`.

## Akcije

`/akcije` i početna čitaju cijeli oktobarski katalog iz `public/web_proizvodi/proizvodi.json` (54 proizvoda, četiri kategorije). Za novi mjesec zamijeni JSON i slike u `public/images/`, putanju u `slikaSrc` (`data/oktobar-akcija.ts`) i stranice letka u `data/flyers.ts`.

## Obrasci (e-pošta)

Kontakt, veleprodaja, prijava na posao (s CV-om do 4 MB) i prijava za Viber katalog šalju se kao e-pošta preko [Resend](https://resend.com). Postavi u okruženju:

```bash
RESEND_API_KEY=re_...
FORMS_FROM_EMAIL="Ali Marketi <sajt@alimarketi.ba>"   # domen mora biti potvrđen u Resendu
FORMS_TO_EMAIL=ali.doo@alimarketi.ba                  # nije obavezno, ovo je zadano
```

Bez ključa obrasci ne glume slanje: korisnik dobije poruku da nazove ili piše na e-poštu. U `npm run dev` svaka poslana poruka se ispiše u terminal.

## TODO za klijenta

- Ubaci prave fotografije poslovnica. Trenutne slike u `public/placeholders` su fotografski uzorci s oznakom PLACEHOLDER, ne konačne fotografije.
- Potvrditi tačne adrese, ulazne koordinate i radno vrijeme svake poslovnice. Sada su kvartaški centri i jedinstveni sati, označeni u `data/stores.ts`.
- Potvrditi da li je sjedište firme ista adresa kao Cash & Carry (Halilovići bb).
- Otvoriti Resend nalog, potvrditi domen alimarketi.ba i upisati ključ (vidi „Obrasci” gore).
- Napraviti Viber listu ili zajednicu za katalog. Prijave s početne i s `/letak` stižu na e-poštu.
- Pravni tekstovi (`/politika-privatnosti`, `/kolacici`) treba da pregleda pravnik prije objave.
- Telefonski broj poslovnica je centrala `062 340 206` dok ne stignu brojevi radnji.
