const PRESETS = [15, 30, 45, 60, 120]

export default function TimeSelector({ minutes, onChange }) {
  return (
    <fieldset className="panel">
      <legend>How much time do you have?</legend>
      <div className="chip-grid">
        {PRESETS.map((value) => (
          <button
            key={value}
            type="button"
            className={minutes === value ? 'chip chip--active' : 'chip'}
            aria-pressed={minutes === value}
            onClick={() => onChange(value)}
          >
            {value >= 120 ? '2 hr+' : `${value} min`}
          </button>
        ))}
        <button
          type="button"
          className={minutes == null ? 'chip chip--active' : 'chip'}
          aria-pressed={minutes == null}
          onClick={() => onChange(null)}
        >
          No limit
        </button>
      </div>
      <label className="slider-row">
        <span>Exact: {minutes == null ? 'any' : `${minutes} min`}</span>
        <input
          type="range"
          min="10"
          max="180"
          step="5"
          value={minutes ?? 180}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </label>
    </fieldset>
  )
}
