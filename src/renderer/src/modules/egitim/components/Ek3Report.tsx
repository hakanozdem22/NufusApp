import { EgitimPlan } from '../models/egitim-types'

interface Ek3ReportProps {
  plan: EgitimPlan
}

export const Ek3Report = ({ plan }: Ek3ReportProps) => {
  const currentYear = new Date().getFullYear()

  // Calculate stats
  const totalLessons = plan.dersler?.length || 0

  // Group by distinct subjects to count "Total Subjects"
  const distinctSubjects = new Set(plan.dersler?.map((d) => d.konu)).size

  // Get date range
  const dates = plan.dersler?.map((d) => d.tarih).sort() || []
  const startDate = dates[0] || ''
  const endDate = dates[dates.length - 1] || ''
  const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`

  return (
    <div className="w-[210mm] mx-auto bg-white p-8 print:p-0 print:w-full text-black font-serif text-sm">
      {/* HEADER */}
      <div className="text-center mb-2 border border-black p-2">
        <h1 className="font-bold mb-2">EK-3</h1>
        <h2 className="font-bold text-lg">İL HİZMET İÇİ EĞİTİM SONUÇ RAPORU</h2>
      </div>

      {/* INFO GRID */}
      <div className="border border-black border-t-0 mb-4">
        <div className="grid grid-cols-[150px_1fr] border-b border-black">
          <div className="p-1 font-bold border-r border-black">(1) İLİ:</div>
          <div className="p-1">TEKİRDAĞ</div>
        </div>
        <div className="grid grid-cols-[150px_1fr] border-b border-black">
          <div className="p-1 font-bold border-r border-black">(2) İLÇE SAYISI:</div>
          <div className="p-1" contentEditable>
            11
          </div>
        </div>
        <div className="grid grid-cols-[150px_1fr] border-b border-black">
          <div className="p-1 font-bold border-r border-black">(3) YILI:</div>
          <div className="p-1">{currentYear}</div>
        </div>
        <div className="grid grid-cols-[150px_1fr]">
          <div className="p-1 font-bold border-r border-black">(4) DÖNEMİ:</div>
          <div className="p-1" contentEditable>
            22
          </div>
        </div>
      </div>

      {/* MAIN TABLE */}
      <table className="w-full border-collapse border border-black text-xs text-center">
        <thead>
          <tr>
            <th colSpan={4} className="border border-black p-1">
              (5) İL MERKEZİ ve İLÇELERDE UYGULANAN EĞİTİM KONULARI
            </th>
            <th colSpan={3} className="border border-black p-1">
              (6) KATILAN
            </th>
            <th colSpan={2} className="border border-black p-1">
              (7) SINAV YAPILMIŞ İSE
            </th>
          </tr>
          <tr>
            <th className="border border-black p-2 align-middle">TARİHLER</th>
            <th className="border border-black p-2 align-middle">KONU NO</th>
            <th className="border border-black p-2 align-middle w-16">TOPLAM KONU</th>
            <th className="border border-black p-2 align-middle w-16">TOPLAM SAAT</th>

            <th className="border border-black p-2 align-middle w-12 rotate-headers">KADIN</th>
            <th className="border border-black p-2 align-middle w-12 rotate-headers">ERKEK</th>
            <th className="border border-black p-2 align-middle w-12 rotate-headers">TOPLAM</th>

            <th className="border border-black p-2 align-middle w-16 rotate-headers">BAŞARILI</th>
            <th className="border border-black p-2 align-middle w-16 rotate-headers">BAŞARISIZ</th>
          </tr>
        </thead>
        <tbody>
          {/* (8) MERKEZ */}
          <tr>
            <td className="border border-black p-2 text-left font-bold" colSpan={9}>
              (8) MERKEZ:
            </td>
          </tr>
          {/* Empty rows for Merkez */}
          <tr>
            <td className="border border-black h-8"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
            <td className="border border-black"></td>
          </tr>

          {/* (9) İLÇELER */}
          <tr>
            <td className="border border-black p-2 text-left font-bold" colSpan={9}>
              (9) İLÇELER:
            </td>
          </tr>

          {/* Data Row */}
          <tr>
            <td className="border border-black p-2">{dateRange}</td>
            <td className="border border-black p-2 text-left text-[10px] leading-tight max-w-[200px]">
              {plan.adi}
              <br />
              <br />
              Konular:
              <ul className="list-disc list-inside">
                {Array.from(new Set(plan.dersler?.map((d) => d.konu)))
                  .slice(0, 3)
                  .map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                {distinctSubjects > 3 && <li>... ve {distinctSubjects - 3} konu daha</li>}
              </ul>
            </td>
            <td className="border border-black p-2 font-bold">{distinctSubjects}</td>
            <td className="border border-black p-2 font-bold">{totalLessons}</td>

            {/* Stats - Editable placeholders */}
            <td
              className="border border-black p-2 bg-yellow-50/50 print:bg-white"
              contentEditable
            ></td>
            <td
              className="border border-black p-2 bg-yellow-50/50 print:bg-white"
              contentEditable
            ></td>
            <td
              className="border border-black p-2 bg-yellow-50/50 print:bg-white"
              contentEditable
            ></td>
            <td
              className="border border-black p-2 bg-yellow-50/50 print:bg-white"
              contentEditable
            ></td>
            <td className="border border-black p-2 bg-yellow-50/50 print:bg-white" contentEditable>
              -
            </td>
          </tr>

          {Array.from({ length: 4 }).map((_, i) => (
            <tr key={i}>
              <td className="border border-black h-8"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
              <td className="border border-black"></td>
            </tr>
          ))}

          {/* (10) GENEL TOPLAM */}
          <tr className="font-bold bg-gray-50 print:bg-transparent">
            <td className="border border-black p-2 text-left" colSpan={2}>
              (10) GENEL TOPLAM
            </td>
            <td className="border border-black p-2">{distinctSubjects}</td>
            <td className="border border-black p-2">{totalLessons}</td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
            <td className="border border-black p-2"></td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER SECTIONS */}
      <div className="mt-4 border border-black text-xs">
        <div className="p-2 border-b border-black min-h-[40px]">
          <strong>(11) MAZERETSİZ KATILMAYANLARA UYGULANAN DİSİPLİN CEZASI (Varsa):</strong> -
        </div>
        <div className="p-2 border-b border-black min-h-[40px]">
          <strong>(12) MÜLKİYE MÜFETTİŞLERİNİN DEĞERLENDİRMESİ (Varsa):</strong> -
        </div>
        <div className="p-2 min-h-[40px]">
          <strong>(13) EĞİTİM PLANI HAKKINDA ÖNERİLERİNİZ:</strong> -
        </div>
      </div>

      {/* SIGNATURES */}
      <div className="mt-8 border border-black flex">
        <div className="flex-1 p-4 text-center border-r border-black">
          <p className="font-bold mb-2">14) FORMU HAZIRLAYAN</p>
          <div className="h-20"></div>
          <p>V.H.K.İ</p>
        </div>
        <div className="flex-1 p-4 text-center">
          <p className="font-bold mb-2">TARIH</p>
          <p className="mb-4">{new Date().toLocaleDateString('tr-TR')}</p>
          <p className="font-bold mb-2">FORMU ONAYLAYAN</p>
          <p className="font-bold">Hüseyin Haydar ÇELİK</p>
          <p>Nüfus Müdürü</p>
        </div>
      </div>
    </div>
  )
}
