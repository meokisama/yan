import type { ComponentType } from "react"

import AvatarDemo from "@/registry/yan/examples/avatar-demo"
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
import ProgressDemo from "@/registry/yan/examples/progress-demo"
import SliderDemo from "@/registry/yan/examples/slider-demo"
import SwitchDemo from "@/registry/yan/examples/switch-demo"

/** Live examples rendered by <ComponentPreview name="..." /> in the docs. */
export const examples: Record<string, ComponentType> = {
  "avatar-demo": AvatarDemo,
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
  "progress-demo": ProgressDemo,
  "slider-demo": SliderDemo,
  "switch-demo": SwitchDemo,
}
