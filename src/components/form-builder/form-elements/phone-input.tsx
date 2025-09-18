"use client"

import { Phone } from "lucide-react"
import { Input } from "@/components/ui/input"

interface PhoneInputProps {
  disabled?: boolean
}

export function PhoneInput({ disabled = false }: PhoneInputProps) {
  return (
    <div className="relative">
      <Input type="tel" disabled={disabled} className="pr-10" placeholder="Enter phone number" />
      <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  )
}