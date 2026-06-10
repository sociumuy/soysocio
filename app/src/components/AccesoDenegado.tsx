export default function AccesoDenegado() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 bg-[#FEF0F0] rounded-2xl flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="text-[#0D0D0D] text-lg font-serif font-semibold mb-1">Acceso restringido</h2>
      <p className="text-[#888] text-sm max-w-xs">
        No tenés permisos para ver esta sección. Contactá al director del club si creés que es un error.
      </p>
    </div>
  )
}
