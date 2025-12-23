import React from 'react'

export default function Header() {
  return (
    <header className="w-full py-4 px-6 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <img src="/logo-banadama.svg" alt="Banadama" width={140} />
      </div>
    </header>
  )
}
