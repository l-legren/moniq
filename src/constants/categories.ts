/**
 * The six fixed expense categories. Ids stay in code (not translated); their display labels come from
 * i18n (`t(CATEGORY_LABEL_KEYS[id])`).
 */

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
