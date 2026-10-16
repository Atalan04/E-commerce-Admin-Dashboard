
function Header() {
  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-200 bg-white/90 backdrop-blur px-4 md:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          A
        </div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-800">
          Admin Dashboard
        </h1>
      </div>
    </header>
  )
}

export default Header




