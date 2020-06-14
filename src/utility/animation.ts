const fadeInVariant = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: -40,
  },
};

const heightInVariant = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: {
      duration: 0.3,
      staggerChildren: 2,
    },
  },
  visible: {
    opacity: 1,
    height: "auto",
    overflow: "hidden",
    transition: {
      duration: 0.3,
      staggerChildren: 2,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: "hidden",
    transition: {
      duration: 0.3,
    },
  },
};

type TFadeInAnimationVariants = {
  variants?: typeof fadeInVariant;
  initial?: "hidden";
  animate?: "visible";
  exit?: "exit";
};

type THeightInAnimationVariants = {
  variants?: typeof heightInVariant;
  initial?: "hidden";
  animate?: "visible";
  exit?: "exit";
};

export interface IAnimationDefinitions {
  fadeIn: TFadeInAnimationVariants;
  heightIn: THeightInAnimationVariants;
}

export const ANIMATION_DEFINITIONS: IAnimationDefinitions = {
  fadeIn: {
    variants: fadeInVariant,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
  },
  heightIn: {
    variants: heightInVariant,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
  },
};

type TCreateAnimationDefinitionReturn = TFadeInAnimationVariants | THeightInAnimationVariants;

export const createAnimationDefinition = ({ animationType }: { animationType: keyof IAnimationDefinitions }): TCreateAnimationDefinitionReturn => {
  if (!animationType) {
    return {};
  }

  return ANIMATION_DEFINITIONS[animationType];
};
