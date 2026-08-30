// Pure scoring logic — no React here so it stays easy to test and tweak.
//
// recommendMeals(recipes, sides, prefs) -> ranked [{ recipe, score, reasons, sides, plan }]
//
// prefs shape (all optional):
//   moods:        string[]  cravings selected in the UI
//   minutes:      number     time available, start to plate
//   diets:        string[]  dietary tags every result must satisfy
//   minProtein:   number     grams per serving, main + chosen side
//   maxCalories:  number     kcal per serving, main + chosen side

import { SIDE_BY_ID } from '../data/recipes.js'

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))

function matchesDiets(item, diets) {
  if (!diets || diets.length === 0) return true
  return diets.every((d) => item.diet.includes(d))
}

// Pick the sides that pair best with a main, within the leftover time budget.
function chooseSides(recipe, prefs) {
  const timeLeft =
    typeof prefs.minutes === 'number' ? prefs.minutes - recipe.minutes : Infinity

  return recipe.pairsWith
    .map((id) => SIDE_BY_ID[id])
    .filter(Boolean)
    .map((side) => {
      let fit = 0
      const reasons = []

      if (side.minutes <= Math.max(timeLeft, 0) || timeLeft === Infinity) {
        fit += 2
      } else {
        fit -= 2
        reasons.push('adds time')
      }

      const sharedMood = (prefs.moods || []).filter((m) => side.mood.includes(m))
      if (sharedMood.length) {
        fit += sharedMood.length
        reasons.push(`matches ${sharedMood.join(' & ')}`)
      }

      if (matchesDiets(side, prefs.diets)) fit += 1
      else fit -= 3

      return { side, fit, reasons }
    })
    .sort((a, b) => b.fit - a.fit)
}

function combinedNutrition(recipe, sides) {
  return [recipe, ...sides].reduce(
    (acc, item) => ({
      calories: acc.calories + item.nutrition.calories,
      protein: acc.protein + item.nutrition.protein,
      carbs: acc.carbs + item.nutrition.carbs,
      fat: acc.fat + item.nutrition.fat,
      fiber: acc.fiber + item.nutrition.fiber,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  )
}

export function recommendMeals(recipes, _sides, prefs = {}) {
  const moods = prefs.moods || []
  const diets = prefs.diets || []

  return recipes
    .filter((r) => matchesDiets(r, diets))
    .map((recipe) => {
      let score = 0
      const reasons = []

      // Mood: the core signal — what you feel like eating.
      const sharedMood = moods.filter((m) => recipe.mood.includes(m))
      if (moods.length === 0) {
        score += 2
      } else if (sharedMood.length) {
        score += sharedMood.length * 4
        reasons.push(`fits your mood (${sharedMood.join(', ')})`)
      } else {
        score -= 3
      }

      // Time available.
      if (typeof prefs.minutes === 'number') {
        if (recipe.minutes <= prefs.minutes) {
          const slack = prefs.minutes - recipe.minutes
          score += 3 + clamp(slack / 15, 0, 2)
          reasons.push(`ready in ${recipe.minutes} min`)
        } else {
          score -= (recipe.minutes - prefs.minutes) / 10
          reasons.push(`runs ${recipe.minutes - prefs.minutes} min over`)
        }
      }

      if (diets.length) reasons.push(`meets ${diets.join(', ')}`)

      // Sides + nutrition of the whole plate.
      const rankedSides = chooseSides(recipe, prefs)
      const topSides = rankedSides.filter((s) => s.fit > 0).slice(0, 2)
      const plate = combinedNutrition(
        recipe,
        topSides.map((s) => s.side),
      )

      if (typeof prefs.minProtein === 'number') {
        if (plate.protein >= prefs.minProtein) {
          score += 3
          reasons.push(`${plate.protein}g protein on the plate`)
        } else {
          score -= 2
          reasons.push(`only ${plate.protein}g protein`)
        }
      }

      if (typeof prefs.maxCalories === 'number') {
        if (plate.calories <= prefs.maxCalories) {
          score += 2
          reasons.push(`${plate.calories} kcal, within budget`)
        } else {
          score -= 2
          reasons.push(`${plate.calories} kcal, over budget`)
        }
      }

      return {
        recipe,
        score: Math.round(score * 10) / 10,
        reasons,
        sides: rankedSides,
        suggestedSides: topSides.map((s) => s.side),
        plateNutrition: plate,
      }
    })
    .sort((a, b) => b.score - a.score)
}
