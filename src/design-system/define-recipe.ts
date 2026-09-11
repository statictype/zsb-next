import {
  defineRecipe as pandaDefineRecipe,
  defineSlotRecipe as pandaDefineSlotRecipe,
} from '@pandacss/dev'
import type {
  RecipeConfig,
  RecipeVariantRecord,
  SlotRecipeConfig,
  SlotRecipeVariantRecord,
} from 'styled-system/types'

export function defineRecipe<V extends RecipeVariantRecord>(config: RecipeConfig<V>) {
  return pandaDefineRecipe(config)
}

export function defineSlotRecipe<S extends string, V extends SlotRecipeVariantRecord<S>>(
  config: SlotRecipeConfig<S, V>,
) {
  return pandaDefineSlotRecipe(config)
}
