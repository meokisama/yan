import { Input } from "@/components/ui/input"

export default function InputDemo() {
  return (
    <label className="flex w-full max-w-xs flex-col gap-2 text-sm font-extrabold">
      Nickname
      <Input placeholder="mochi-chan" />
    </label>
  )
}
