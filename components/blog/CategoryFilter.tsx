'use client'

interface CategoryFilterProps {
  categories: string[]
  selected: string
  onSelect: (category: string) => void
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const all = ['Todos', ...categories]

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat === 'Todos' ? '' : cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            (cat === 'Todos' && !selected) || cat === selected
              ? 'bg-navy text-white'
              : 'bg-gray-100 text-carvao/70 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
