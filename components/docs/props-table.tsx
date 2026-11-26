export type PropRow = {
  name: string
  type: string
  default?: string
  description: string
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl shadow-[inset_0_0_0_2px_var(--border)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-accent font-display text-base text-foreground">
          <tr>
            <th className="px-4 py-2.5 font-normal">Prop</th>
            <th className="px-4 py-2.5 font-normal">Type</th>
            <th className="px-4 py-2.5 font-normal">Default</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-t-2 border-dashed align-top">
              <td className="px-4 py-3">
                <code className="rounded-full bg-primary/25 px-2 py-0.5 font-mono text-[13px] font-bold text-yan-sakura-edge dark:text-yan-sakura">
                  {row.name}
                </code>
                <p className="mt-1.5 text-muted-foreground">{row.description}</p>
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-[13px]">{row.type}</code>
              </td>
              <td className="px-4 py-3">
                <code className="font-mono text-[13px]">{row.default ?? "-"}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
