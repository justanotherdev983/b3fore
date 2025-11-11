"use client"

import { UserButton, useUser } from "@clerk/nextjs"
import { Badge } from "~/components/ui/badge"

export function UserMenu() {
  const { user } = useUser()

  return (
    <div className="flex items-center gap-3">
      {user && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-[#414868] text-[#9ece6a]">
            {user.emailAddresses[0]?.emailAddress}
          </Badge>
        </div>
      )}

      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-8 h-8",
            userButtonPopoverCard: "bg-[#1a1b26] border-[#414868]",
            userButtonPopoverActionButton: "text-[#c0caf5] hover:bg-[#292e42]",
            userButtonPopoverActionButtonText: "text-[#c0caf5]",
            userButtonPopoverActionButtonIcon: "text-[#7aa2f7]",
            userButtonPopoverFooter: "hidden",
          },
        }}
      />
    </div>
  )
}
