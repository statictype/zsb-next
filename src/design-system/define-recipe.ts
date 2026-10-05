import {
  defineRecipe as pandaDefineRecipe,
  defineSlotRecipe as pandaDefineSlotRecipe,
} from '@pandacss/dev'
import type {
  RecipeDefinition,
  RecipeVariantRecord,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
} from 'styled-system/types'

type PandaRecipeConfig = Parameters<typeof pandaDefineRecipe>[0]
type PandaSlotRecipeConfig = Parameters<typeof pandaDefineSlotRecipe>[0]
type RecipeMeta = Pick<PandaRecipeConfig, 'className' | 'description' | 'jsx' | 'staticCss'>

export function defineRecipe<V extends RecipeVariantRecord>(
  config: RecipeDefinition<V> & RecipeMeta,
) {
  return pandaDefineRecipe(config as unknown as PandaRecipeConfig)
}

export function defineSlotRecipe<S extends string, V extends SlotRecipeVariantRecord<S>>(
  config: SlotRecipeDefinition<S, V> & Omit<RecipeMeta, 'className'>,
) {
  return pandaDefineSlotRecipe(config as unknown as PandaSlotRecipeConfig)
}
