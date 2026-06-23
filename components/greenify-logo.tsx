export function GreenifyLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2C6455" />
          <stop offset="100%" stopColor="#1a3d35" />
        </linearGradient>
      </defs>

      {/* Main leaf shape */}
      <path
        d="M50 10 C30 10, 15 25, 15 45 C15 65, 30 80, 50 90 C70 80, 85 65, 85 45 C85 25, 70 10, 50 10 Z"
        fill="url(#leafGradient)"
      />

      {/* Leaf vein */}
      <path d="M50 15 Q50 30, 50 45 Q50 60, 50 85" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.7" />

      {/* Side veins */}
      <path d="M50 25 Q40 30, 35 35" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M50 25 Q60 30, 65 35" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M50 40 Q40 45, 30 50" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M50 40 Q60 45, 70 50" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M50 55 Q40 60, 35 65" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.5" />
      <path d="M50 55 Q60 60, 65 65" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.5" />
    </svg>
  )
}
