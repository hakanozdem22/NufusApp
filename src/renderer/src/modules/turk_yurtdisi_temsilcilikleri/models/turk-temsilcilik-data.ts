import { TurkTemsilcilik } from './turk-temsilcilik-types'

export const EKLENECEK_TURK_TEMSILCILIKLERI_DETAYLI: Omit<TurkTemsilcilik, 'id'>[] = [
  {
    ulke: 'AMERİKA BİRLEŞİK DEVLETLERİ',
    tip: 'Büyükelçilik',
    sehir: 'Washington',
    adres: '2525 Massachusetts Avenue, N.W. Washington, D.C. 20008',
    telefon: '+1 202 612 67 00',
    eposta: 'embassy.washington@mfa.gov.tr',
    web_sitesi: 'http://washington.emb.mfa.gov.tr',
    bayrak_kodu: 'US'
  },
  {
    ulke: 'ALMANYA',
    tip: 'Büyükelçilik',
    sehir: 'Berlin',
    adres: 'Tiergartenstr. 19-21 10785 Berlin',
    telefon: '+49 30 275850',
    eposta: 'botschaft.berlin@mfa.gov.tr',
    web_sitesi: 'http://berlin.emb.mfa.gov.tr',
    bayrak_kodu: 'DE'
  },
  {
    ulke: 'FRANSA',
    tip: 'Büyükelçilik',
    sehir: 'Paris',
    adres: '16 Avenue de Lamballe 75016 Paris',
    telefon: '+33 1 53 92 71 11',
    eposta: 'ambassade.paris@mfa.gov.tr',
    web_sitesi: 'http://paris.emb.mfa.gov.tr',
    bayrak_kodu: 'FR'
  },
  {
    ulke: 'İNGİLTERE',
    tip: 'Büyükelçilik',
    sehir: 'Londra',
    adres: '43 Belgrave Square, London SW1X 8PA',
    telefon: '+44 20 7393 0202',
    eposta: 'embassy.london@mfa.gov.tr',
    web_sitesi: 'http://london.emb.mfa.gov.tr',
    bayrak_kodu: 'GB'
  }
]
