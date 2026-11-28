import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar"

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Avatar size="lg" emote="♪">
        <AvatarImage src="/mochi-avatar.svg" alt="Mochi-chan" />
        <AvatarFallback>MC</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        <Avatar color="lavender">
          <AvatarFallback>YU</AvatarFallback>
        </Avatar>
        <Avatar color="mint">
          <AvatarFallback>MI</AvatarFallback>
        </Avatar>
        <Avatar color="lemon">
          <AvatarFallback>RE</AvatarFallback>
        </Avatar>
        <Avatar color="sky">
          <AvatarFallback>+3</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  )
}
