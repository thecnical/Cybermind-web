export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5750F1]">
        <span className="text-xs font-bold text-white">CM</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-900 dark:text-white">CyberMind</p>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">Admin Panel</p>
      </div>
    </div>
  );
}
