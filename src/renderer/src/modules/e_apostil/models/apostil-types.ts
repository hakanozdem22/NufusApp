export interface ApostilUlke {
  id: number
  ulke_adi: string
  bayrak_url: string
  site_url: string
  aciklama: string
  dosya_sayisi?: number
}

export interface ApostilDosya {
  id: number
  ad: string
  yol: string
  tip: 'DOSYA' | 'LINK'
}

export interface SiteLink {
  url: string
  aciklama: string
}

export const ULKE_KODLARI: Record<string, string> = {
  ALMANYA: 'DE',
  ABD: 'US',
  AMERİKA: 'US',
  ARNAVUTLUK: 'AL',
  AVUSTURYA: 'AT',
  AZERBAYCAN: 'AZ',
  BAHAMALAR: 'BS',
  BAHREYN: 'BH',
  BELÇİKA: 'BE',
  'BEYAZ RUSYA': 'BY',
  'BİRLEŞİK ARAP EMİRLİKLERİ': 'AE',
  'BİRLEŞİK KRALLIK': 'GB',
  'BOSNA HERSEK': 'BA',
  BREZİLYA: 'BR',
  BULGARİSTAN: 'BG',
  'ÇEK CUMHURİYETİ': 'CZ',
  DANIMARKA: 'DK',
  ESTONYA: 'EE',
  FAS: 'MA',
  'FİLDİŞİ SAHİLİ': 'CI',
  FİLİPİNLER: 'PH',
  FİNLANDİYA: 'FI',
  FRANSA: 'FR',
  'GÜNEY AFRİKA': 'ZA',
  GÜRCİSTAN: 'GE',
  HIRVATİSTAN: 'HR',
  HOLLANDA: 'NL',
  IRAK: 'IQ',
  İRAN: 'IR',
  İSRAİL: 'IL',
  İSVEÇ: 'SE',
  İSVİÇRE: 'CH',
  İTALYA: 'IT',
  KARADAĞ: 'ME',
  KATAR: 'QA',
  KAZAKİSTAN: 'KZ',
  KENYA: 'KE',
  KIRGIZİSTAN: 'KG',
  KUVEYT: 'KW',
  'KUZEY MAKEDONYA': 'MK',
  KÜBA: 'CU',
  LETONYA: 'LV',
  LİBERYA: 'LR',
  LİTVANYA: 'LT',
  LÜKSEMBURG: 'LU',
  MACARİSTAN: 'HU',
  MOĞOLİSTAN: 'MN',
  MOLDOVA: 'MD',
  MONAKO: 'MC',
  MYANMAR: 'MM',
  NİJER: 'NE',
  NİJERYA: 'NG',
  NORVEÇ: 'NO',
  'ORTA AFRİKA CUMHURİYETİ': 'CF',
  ÖZBEKİSTAN: 'UZ',
  PAKİSTAN: 'PK',
  PERU: 'PE',
  POLONYA: 'PL',
  PORTEKİZ: 'PT',
  ROMANYA: 'RO',
  RUSYA: 'RU',
  'SAN MARİNO': 'SM',
  SENEGAL: 'SN',
  SEYŞELLER: 'SC',
  SIRBİSTAN: 'RS',
  SLOVAKYA: 'SK',
  SLOVENYA: 'SI',
  'SUUDİ ARABİSTAN': 'SA',
  TACİKİSTAN: 'TJ',
  TAYLAND: 'TH',
  TUNUS: 'TN',
  TÜRKİYE: 'TR',
  TÜRKMENİSTAN: 'TM',
  UKRAYNA: 'UA',
  URUGUAY: 'UY',
  VENEZUELA: 'VE',
  VİETNAM: 'VN',
  YUNANİSTAN: 'GR',
  ZİMBABVE: 'ZW',
  AVUSTRALYA: 'AU',
  BANGLADEŞ: 'BD',
  BARBADOS: 'BB',
  BENİN: 'BJ',
  BOTSVANA: 'BW',
  'BURKİNA FASO': 'BF',
  CEZAYİR: 'DZ',
  'DOMİNİK CUMHURİYETİ': 'DO',
  EKVADOR: 'EC',
  FİJİ: 'FJ',
  GANA: 'GH',
  GUATEMALA: 'GT',
  HAİTİ: 'HT',
  HİNDİSTAN: 'IN',
  İZLANDA: 'IS',
  JAMAİKA: 'JM',
  JAPONYA: 'JP',
  KAMBOÇYA: 'KH',
  KANADA: 'CA',
  'KONGO CUMHURİYETİ': 'CG',
  'KONGO DEMOKRATİK CUMHURİYETİ': 'CD',
  'KORE CUMHURİYETİ (GÜNEY KORE)': 'KR',
  LAOS: 'LA',
  LÜBNAN: 'LB',
  MADAGASKAR: 'MG',
  MALEZYA: 'MY',
  MALİ: 'ML',
  MALTA: 'MT',
  MISIR: 'EG',
  NAMİBYA: 'NA',
  'PAPUA YENİ GİNE': 'PG',
  PARAGUAY: 'PY',
  RUANDA: 'RW',
  'SİERRA LEONE': 'SL',
  SİNGAPUR: 'SG',
  'SRİ LANKA': 'LK',
  SURİYE: 'SY',
  ŞİLİ: 'CL',
  TOGO: 'TG',
  'TRİNİDAD VE TOBAGO': 'TT',
  UGANDA: 'UG',
  ÜRDÜN: 'JO',
  'YENİ ZELANDA': 'NZ'
}

export const ULKE_LINKLERI: Record<string, string> = {
  TÜRKİYE: 'https://www.turkiye.gov.tr/belge-dogrulama'
}

export const EKLENECEK_ULKELER_LISTESI = Object.keys(ULKE_KODLARI).filter((k) => k !== 'AMERİKA')
