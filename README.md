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

## TODO za klijenta

- Zamijeniti tipografski znak službenim logotipom (narančasti „ali MARKETI”).
- Ubaci prave fotografije poslovnica i proizvoda. Trenutne slike u `public/placeholders` su fotografski uzorci s oznakom PLACEHOLDER, ne konačne fotografije.
- Potvrditi tačne adrese, ulazne koordinate i radno vrijeme svake poslovnice. Sada su kvartaški centri i jedinstveni sati, označeni u `data/stores.ts`.
- Potvrditi da li je sjedište firme ista adresa kao Cash & Carry (Halilovići bb).
- Zamijeniti PDF-ove u `public/letci` i stranice letka pravim sedmičnim letkom.
- Spojiti obrasce (kontakt, veleprodaja, prijava na posao, Viber broj) na e-poštu ili form servis. Sada ostaju u pregledniku i to jasno piše korisniku.
- CV upload je samo izbor fajla na uređaju. Nema slanja.
- Pravni tekstovi (`/politika-privatnosti`, `/kolacici`) treba da pregleda pravnik prije objave.
- Telefonski broj poslovnica je centrala `062 340 206` dok ne stignu brojevi radnji.
