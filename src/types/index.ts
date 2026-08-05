export type SectionId =
  | "hero"
  | "marquee"
  | "heritage"
  | "bridge-1"
  | "challenge"
  | "research"
  | "market-reality"
  | "personas"
  | "identity"
  | "bridge-2"
  | "packaging"
  | "innovation"
  | "marketing"
  | "build"
  | "vision"
  | "social-proof"
  | "final";

export type FeatureTier = 1 | 2 | 3;

export type PackagingType = "bottle" | "can";

export type Base = "water" | "milk" | "yogurt" | "smoothie";

export type Ingredient = {
  readonly id: string;
  readonly name: string;
  readonly category: "fruit" | "herb" | "spice" | "floral";
  readonly color: string;
};

export type RecipeCreation = {
  readonly id: string;
  readonly name: string;
  readonly base: Base;
  readonly ingredients: readonly Ingredient[];
  readonly packaging: PackagingType;
  readonly createdAt: number;
  readonly updatedAt: number;
};

export type RecipeAction =
  | { type: "SET_INGREDIENT"; ingredient: Ingredient }
  | { type: "REMOVE_INGREDIENT"; ingredientId: string }
  | { type: "RANDOMIZE" }
  | { type: "RESET" }
  | { type: "SET_NAME"; name: string }
  | { type: "SET_PACKAGING"; packaging: PackagingType }
  | { type: "SET_BASE"; base: Base };

export type ImageManifestEntry = {
  readonly id: string;
  readonly category: string;
  readonly filename: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly orientation: "portrait" | "landscape" | "square";
  readonly bytes: number;
};

export type AnimationId = string;

export type SectionConfig = {
  readonly id: SectionId;
  readonly component: React.LazyExoticComponent<React.ComponentType>;
  readonly tier: FeatureTier;
  readonly hasAnimation: boolean;
};

export type Env = {
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly PROD: boolean;
  readonly DEV: boolean;
};
