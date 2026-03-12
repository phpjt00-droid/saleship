export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-white/80 backdrop-blur-sm flex justify-center items-center z-[9999] transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#1E88E5] rounded-full animate-spin"></div>
      </div>
    </div>
  )
}
