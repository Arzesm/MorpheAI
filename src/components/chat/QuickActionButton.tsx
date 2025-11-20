import { LucideIcon } from 'lucide-react'

interface QuickActionButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
}

export default function QuickActionButton({ icon: Icon, label, onClick }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="card p-3 hover:bg-morphe-blue/15 transition-all flex items-center space-x-2 text-left"
    >
      <Icon size={18} className="text-morphe-blue flex-shrink-0" />
      <span className="text-mythic-ivory text-sm">{label}</span>
    </button>
  )
}

