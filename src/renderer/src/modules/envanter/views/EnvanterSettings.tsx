
import { useEffect, useState } from 'react'
import { Plus, Trash, X } from 'lucide-react'

// Generic Simple Table Component for Definitions
const DefinitionTable = ({ title, items, onDelete, onAdd }) => {
    const [newValue, setNewValue] = useState('')

    const handleAdd = () => {
        if (!newValue.trim()) return
        onAdd(newValue)
        setNewValue('')
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-4">
            <h3 className="font-bold text-lg mb-3 dark:text-white">{title}</h3>
            <div className="flex gap-2 mb-4">
                <input
                    className="flex-1 border rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Yeni Ekle..."
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <button onClick={handleAdd} className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
                    <Plus size={20} />
                </button>
            </div>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
                {items.map(item => (
                    <li key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                        <span className="dark:text-gray-200">{item.ad || item.yer_adi}</span>
                        <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash size={16} />
                        </button>
                    </li>
                ))}
                {items.length === 0 && <li className="text-gray-400 text-sm italic">Kayıt yok.</li>}
            </ul>
        </div>
    )
}

export const EnvanterSettings = () => {
    const [kategoriler, setKategoriler] = useState([])
    const [yerler, setYerler] = useState([])
    const [personeller, setPersoneller] = useState([]) // Personel tanımları (Harcama/Envanter ortak olabilir ama burada ayrı tutuyoruz)

    const fetchData = async () => {
        setKategoriler(await window.api.getEnvanterKategoriler())
        setYerler(await window.api.getEnvanterYerler())
        setPersoneller(await window.api.getEnvanterPersonelTanimlari())
    }

    useEffect(() => {
        fetchData()
    }, [])

    // HANDLERS
    const addKategori = async (text) => { await window.api.addEnvanterKategori(text); fetchData(); }
    const delKategori = async (id) => { await window.api.deleteEnvanterKategori(id); fetchData(); }

    const addYer = async (text) => { await window.api.addEnvanterYer(text); fetchData(); }
    const delYer = async (id) => { await window.api.deleteEnvanterYer(id); fetchData(); }

    const addPersonel = async (text) => { await window.api.addEnvanterPersonelTanim(text); fetchData(); }
    const delPersonel = async (id) => { await window.api.deleteEnvanterPersonelTanim(id); fetchData(); }

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Envanter Tanımları</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DefinitionTable title="Kategoriler" items={kategoriler} onAdd={addKategori} onDelete={delKategori} />
                <DefinitionTable title="Kullanım Yerleri" items={yerler} onAdd={addYer} onDelete={delYer} />
                <DefinitionTable title="Personel Listesi" items={personeller} onAdd={addPersonel} onDelete={delPersonel} />
            </div>
        </div>
    )
}
