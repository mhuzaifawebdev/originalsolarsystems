import Image from 'next/image'
import Link from 'next/link'

interface BrandCardProps {
  id: string
  name: string
  logo_url: string | null
}

export default function BrandCard({ id, name, logo_url }: BrandCardProps) {
  return (
    <Link
      href={`/verify?brand=${encodeURIComponent(name)}`}
      className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
        {logo_url ? (
          <Image src={logo_url} alt={name} width={80} height={80} className="object-contain w-full h-full" />
        ) : (
          <span className="text-3xl font-bold text-gray-300">{name[0]}</span>
        )}
      </div>
      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 text-center">{name}</span>
    </Link>
  )
}
