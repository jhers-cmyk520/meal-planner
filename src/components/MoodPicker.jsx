import { MOODS } from '../data/recipes.js'

export default function MoodPicker({ selected, onToggle }) {
  return (
    <fieldset className="panel">
      <legend>What do you feel like eating?</legend>
      <div className="chip-grid">
        {MOODS.map((mood) => {
          const active = selected.includes(mood.id)
          return (
            <button
              key={mood.id}
              type="button"
              className={active ? 'chip chip--active' : 'chip'}
              aria-pressed={active}
              onClick={() => onToggle(mood.id)}
            >
              <span aria-hidden="true">{mood.emoji}</span> {mood.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
