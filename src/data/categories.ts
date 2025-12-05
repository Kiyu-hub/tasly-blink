// Product categories for Tasly Ghana 346
export const PRODUCT_CATEGORIES = [
  'Heart Health',
  'Immunity & Energy',
  'Brain Health',
  'Liver Health',
  'Digestive Health',
  'Weight Management',
  'Herbal Tea',
  'Beauty & Wellness',
  'Bone Health',
  'Respiratory Health',
  'Joint Health',
  'Blood Sugar Support',
  'General Wellness'
] as const

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]
