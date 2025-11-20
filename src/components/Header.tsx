import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface HeaderProps {
  showBackButton?: boolean
  backTo?: string
  title?: string
  rightElement?: React.ReactNode
}

export default function Header({ showBackButton = false, backTo = '/portal', title, rightElement }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-6">
      {/* Left side - Back button or Logo */}
      {showBackButton ? (
        <Link href={backTo} className="text-mythic-ivory hover:text-morphe-blue transition-colors">
          <ArrowLeft size={24} />
        </Link>
      ) : (
        <Link href="/portal" className="relative w-40 h-12 cursor-pointer group">
          <Image
            src="https://i.postimg.cc/nznsrDSf/cbb6618b-6539-4097-a39c-81dc01fe57d4.png"
            alt="MorpheAI Logo"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(30,144,255,0.3)] transition-all group-hover:drop-shadow-[0_0_25px_rgba(30,144,255,0.5)] group-hover:scale-105"
            priority
          />
        </Link>
      )}

      {/* Center - Title (optional) */}
      {title && (
        <h1 className="text-xl font-bold text-mythic-ivory absolute left-1/2 transform -translate-x-1/2">
          {title}
        </h1>
      )}

      {/* Right side - Custom element or Logo */}
      {rightElement ? (
        rightElement
      ) : (
        !showBackButton && (
          <Link href="/portal" className="relative w-40 h-12 cursor-pointer group opacity-0 pointer-events-none">
            <Image
              src="https://i.postimg.cc/nznsrDSf/cbb6618b-6539-4097-a39c-81dc01fe57d4.png"
              alt="MorpheAI Logo"
              fill
              className="object-contain"
            />
          </Link>
        )
      )}
    </header>
  )
}

