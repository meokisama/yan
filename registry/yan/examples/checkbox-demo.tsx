import { Checkbox } from "@/components/ui/checkbox"

const chores = ["Pet the mochi", "Add more sparkles", "Ship it"]

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      {chores.map((chore, i) => (
        <label key={chore} className="flex cursor-pointer items-center gap-3 text-sm font-bold">
          <Checkbox defaultChecked={i === 0} />
          <span className="transition-opacity peer-data-[state=checked]:line-through peer-data-[state=checked]:opacity-50">
            {chore}
          </span>
        </label>
      ))}
    </div>
  )
}
