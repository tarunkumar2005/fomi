"use client"

import { Mail } from "lucide-react"
import { Input } from "@/components/ui/input"

interface EmailInputProps {
  disabled?: boolean
}

export function EmailInput({ disabled = false }: EmailInputProps) {
  return (
    <div className="relative">
      <Input type="email" disabled={disabled} className="pr-10" placeholder="Enter email address" />
      <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  )
}