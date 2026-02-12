export { useKeyboardShortcuts } from './useKeyboardShortcuts'
export { useAIRecommendations } from './useAIRecommendations'
export { useSkillSearch, type SortOption } from './useSkillSearch'
export { useSkillNavigation } from './useSkillNavigation'
export { useHoverPreview } from './useHoverPreview'
export { useCardAnimation } from './useCardAnimation'
export { useShapeMorph } from './useShapeMorph'

// Re-export animation hooks from @n3wth/ui
export {
  useScrollReveal,
  usePageTransition,
  useButtonPulse,
  useTextReveal,
  useCountUp,
  useStaggerList,
} from '@n3wth/ui'

// Project-specific delight hooks
export { useRipple } from './useRipple'
export { useMagneticHover } from './useMagneticHover'
export { useSuccessBounce, useShake, usePulse } from './useSuccessBounce'
