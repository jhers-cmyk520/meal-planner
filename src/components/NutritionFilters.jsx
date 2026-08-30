import { DIETS } from '../data/recipes.js'

export default function NutritionFilters({
  diets,
  onToggleDiet,
  minProtein,
  onMinProtein,
  maxCalories,
  onMaxCalories,
}) {
  return (
    <fieldset className="panel">
      <legend>Nutritional needs</legend>

      <div className="chip-grid">
        {DIETS.map((diet) => {
          const active = diets.includes(diet.id)
          return (
            <button
              key={diet.id}
              type="button"
              className={active ? 'chip chip--active' : 'chip'}
              aria-pressed={active}
              onClick={() => onToggleDiet(diet.id)}
            >
              {diet.label}
            </button>
          )
        })}
      </div>

      <label className="slider-row">
        <span>Min protein / plate: {minProtein == null ? 'off' : `${minProtein}g`}</span>
        <input
          type="range"
          min="0"
          max="60"
          step="5"
          value={minProtein ?? 0}
          onChange={(e) => {
            const v = Number(e.target.value)
            onMinProtein(v === 0 ? null : v)
          }}
        />
      </label>

      <label className="slider-row">
        <span>Max calories / plate: {maxCalories == null ? 'off' : `${maxCalories} kcal`}</span>
        <input
          type="range"
          min="300"
          max="1200"
          step="50"
          value={maxCalories ?? 1200}
          onChange={(e) => {
            const v = Number(e.target.value)
            onMaxCalories(v === 1200 ? null : v)
          }}
        />
      </label>
    </fieldset>
  )
}
