'use client'

interface InputFieldProps {
  id: string
  label: string
  type: string
  placeholder: string
  required?: boolean
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function InputField({ 
  id, 
  label, 
  type, 
  placeholder, 
  required = false,
  value,
  onChange 
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-muted-foreground"
        placeholder={placeholder}
      />
    </div>
  )
}
