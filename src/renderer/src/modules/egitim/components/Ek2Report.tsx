import { EgitimPlan } from '../models/egitim-types'

interface Ek2ReportProps {
  plan: EgitimPlan
}

export const Ek2Report = ({ plan }: Ek2ReportProps) => {
  // Group lessons by Subject
  const groupedLessons =
    plan.dersler?.reduce((acc: any[], curr: any) => {
      const existing = acc.find((item) => item.konu === curr.konu && item.egitici === curr.egitici)
      if (!existing) {
        acc.push({ konu: curr.konu, egitici: curr.egitici })
      }
      return acc
    }, []) || []

  return (
    <div className="w-[210mm] mx-auto bg-white p-8 print:p-0 print:w-full text-black font-serif text-sm">
      {/* HEADER */}
      <div className="text-center mb-6 space-y-1">
        <h1 className="font-bold text-lg">EK-2</h1>
        <h2 className="font-bold text-lg">ANKET FORMU ÖRNEĞİ</h2>
        <div className="mt-4 font-bold">
          <p>Eğitimin Adı: {plan.adi}</p>
          <p>Tarihi: {new Date(plan.olusturma_tarihi).toLocaleDateString('tr-TR')}</p>
          <p>DEĞERLENDİRME ANKETİ</p>
        </div>
      </div>

      <div className="mb-2 text-justify text-xs">
        <h3 className="font-bold text-center mb-2">KONULAR VE EĞİTİM GÖREVLİLERİ</h3>
        <p>
          Aşağıda isimleri verilmiş her bir konuyu ve ilgili eğitim görevlisini konulara hâkim olma,
          etkin anlatım yöntemi kullanma, derse ilgiyi sağlama ve soruları yanıtlama bakımından ne
          derece faydalı bulduğunuzu kutulardaki ifadelere göre 'X' ile işaretleyiniz.
        </p>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="border border-black p-1 text-center bg-gray-100 print:bg-gray-100"
            >
              HER BİR KONUYU VE EĞİTİM GÖREVLİSİNİ AYRI AYRI PUANLAYINIZ.
            </th>
            <th className="border border-black p-1 text-center w-16">Çok İyi</th>
            <th className="border border-black p-1 text-center w-16">İyi</th>
            <th className="border border-black p-1 text-center w-16">Orta</th>
            <th className="border border-black p-1 text-center w-16">İyi Değil</th>
            <th className="border border-black p-1 text-center w-16">Hiç İyi Değil</th>
          </tr>
          <tr>
            <th colSpan={2} className="border border-black p-1 text-center">
              Konular ve Eğitim Görevlileri
            </th>
            <th className="border border-black p-1 text-center"></th>
            <th className="border border-black p-1 text-center"></th>
            <th className="border border-black p-1 text-center"></th>
            <th className="border border-black p-1 text-center"></th>
            <th className="border border-black p-1 text-center"></th>
          </tr>
        </thead>
        <tbody>
          {groupedLessons.map((item, index) => (
            <>
              <tr key={`topic-${index}`}>
                <td
                  className="border border-black p-1 w-8 text-center font-bold align-middle"
                  rowSpan={2}
                >
                  {index + 1}
                </td>
                <td className="border border-black p-1 font-bold">{item.konu}</td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
              </tr>
              <tr key={`trainer-${index}`}>
                <td className="border border-black p-1 pl-4 italic">{item.egitici}</td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
                <td className="border border-black p-1"></td>
              </tr>
            </>
          ))}
          {/* Fill empty rows if needed to look like a full page */}
          {Array.from({ length: Math.max(0, 15 - groupedLessons.length) }).map((_, i) => (
            <tr key={`empty-${i}`}>
              <td className="border border-black p-4"></td>
              <td className="border border-black p-4"></td>
              <td className="border border-black p-4"></td>
              <td className="border border-black p-4"></td>
              <td className="border border-black p-4"></td>
              <td className="border border-black p-4"></td>
              <td className="border border-black p-4"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
