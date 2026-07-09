/**
 * The six fixed expense categories. Ids stay in code (not translated); their display labels come from
 * i18n (`t(CATEGORY_LABEL_KEYS[id])`).
 */

import type { ComponentProps } from 'react';
import type Ionicons from '@expo/vector-icons/Ionicons';

export const CATEGORY_IDS = [
  'groceries',
  'drinks',
  'restaurants',
  'clothing',
  'transport',
  'other',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const CATEGORY_LABEL_KEYS: Record<CategoryId, string> = {
  groceries: 'categories.groceries',
  drinks: 'categories.drinks',
  restaurants: 'categories.restaurants',
  clothing: 'categories.clothing',
  transport: 'categories.transport',
  other: 'categories.other',
};

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Icon tied to each category id — the single source of truth for category iconography.
 * Reused anywhere a category needs a visual mark (add-expense picker, activity rows,
 * breakdown lists, …), not just the add-expense modal it was introduced for.
 */
export const CATEGORY_ICONS: Record<CategoryId, IoniconName> = {
  groceries: 'cart-outline',
  drinks: 'wine-outline',
  restaurants: 'restaurant-outline',
  clothing: 'shirt-outline',
  transport: 'car-outline',
  other: 'ellipsis-horizontal-circle-outline',
};
