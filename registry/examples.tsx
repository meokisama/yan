import type { ComponentType } from "react"

import AccordionDemo from "@/registry/yan/examples/accordion-demo"
import AvatarDemo from "@/registry/yan/examples/avatar-demo"
import CardDemo from "@/registry/yan/examples/card-demo"
import CardInteractive from "@/registry/yan/examples/card-interactive"
import DropdownMenuDemo from "@/registry/yan/examples/dropdown-menu-demo"
import LabelDemo from "@/registry/yan/examples/label-demo"
import PopoverDemo from "@/registry/yan/examples/popover-demo"
import RadioGroupDemo from "@/registry/yan/examples/radio-group-demo"
import SkeletonDemo from "@/registry/yan/examples/skeleton-demo"
import TextareaDemo from "@/registry/yan/examples/textarea-demo"
import DialogDemo from "@/registry/yan/examples/dialog-demo"
import InputDemo from "@/registry/yan/examples/input-demo"
import SelectDemo from "@/registry/yan/examples/select-demo"
import TabsDemo from "@/registry/yan/examples/tabs-demo"
import ToastDemo from "@/registry/yan/examples/toast-demo"
import TooltipDemo from "@/registry/yan/examples/tooltip-demo"
import BadgeDemo from "@/registry/yan/examples/badge-demo"
import ButtonDemo from "@/registry/yan/examples/button-demo"
import ButtonIntensity from "@/registry/yan/examples/button-intensity"
import ButtonSizes from "@/registry/yan/examples/button-sizes"
import ButtonVariants from "@/registry/yan/examples/button-variants"
import CheckboxDemo from "@/registry/yan/examples/checkbox-demo"
import FxEffects from "@/registry/yan/examples/fx-effects"
import FxRecipes from "@/registry/yan/examples/fx-recipes"
import ProgressDemo from "@/registry/yan/examples/progress-demo"
import SliderDemo from "@/registry/yan/examples/slider-demo"
import SwitchDemo from "@/registry/yan/examples/switch-demo"

/** Live examples rendered by <ComponentPreview name="..." /> in the docs. */
export const examples: Record<string, ComponentType> = {
  "accordion-demo": AccordionDemo,
  "avatar-demo": AvatarDemo,
  "card-demo": CardDemo,
  "card-interactive": CardInteractive,
  "dropdown-menu-demo": DropdownMenuDemo,
  "label-demo": LabelDemo,
  "popover-demo": PopoverDemo,
  "radio-group-demo": RadioGroupDemo,
  "skeleton-demo": SkeletonDemo,
  "textarea-demo": TextareaDemo,
  "dialog-demo": DialogDemo,
  "input-demo": InputDemo,
  "select-demo": SelectDemo,
  "tabs-demo": TabsDemo,
  "toast-demo": ToastDemo,
  "tooltip-demo": TooltipDemo,
  "badge-demo": BadgeDemo,
  "button-demo": ButtonDemo,
  "button-intensity": ButtonIntensity,
  "button-sizes": ButtonSizes,
  "button-variants": ButtonVariants,
  "checkbox-demo": CheckboxDemo,
  "fx-effects": FxEffects,
  "fx-recipes": FxRecipes,
  "progress-demo": ProgressDemo,
  "slider-demo": SliderDemo,
  "switch-demo": SwitchDemo,
}
