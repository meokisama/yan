import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Avatar size="lg">
        <AvatarImage src="/mochi-avatar.svg" alt="Mochi-chan" />
        <AvatarFallback>MC</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar variant="lavender">
          <AvatarFallback>YU</AvatarFallback>
        </Avatar>
        <Avatar variant="mint">
          <AvatarFallback>MI</AvatarFallback>
        </Avatar>
        <Avatar variant="lemon">
          <AvatarFallback>RE</AvatarFallback>
        </Avatar>
        <Avatar variant="sky">
          <AvatarFallback>+3</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  )
}
