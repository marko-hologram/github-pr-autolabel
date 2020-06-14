import { IAnimationDefinitions } from "~/src/utility/animation";

export interface IVariant {
  variant?: "primary" | "secondary" | "danger" | "success";
}

export interface IAnimationBase {
  animationType?: keyof IAnimationDefinitions;
}
