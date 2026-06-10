import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between h-[50px] z-30 px-6 py-4 bg-[#111111] text-white">
      {/* LEFT LOGO */}
      <div className="text-2xl font-bold tracking-wider">
        Plakoro
      </div>

      {/* RIGHT MENU */}
      <div className="flex items-center space-x-6 text-sm font-medium">
        {/* ตรงนี้เตรียมไว้ใส่ฟังก์ชันแปลภาษา เช่น t('help') */}
        <Link href="/" className="flex items-center gap-2 hover:text-yellow-400">
          <span>❓</span> Help
        </Link>
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        
        {/* ปุ่มเปลี่ยนภาษา */}
        <button className="flex items-center gap-1 hover:text-yellow-400">
          <span>🌐</span> EN
        </button>

        <Link href="/collection" className="flex items-center gap-2 hover:text-yellow-400">
          <span>📚</span> Collection
        </Link>
        <Link href="/login" className="flex items-center gap-2 hover:text-yellow-400">
          <span>👤</span> Sign-up/Sign-in
        </Link>
      </div>
    </nav>
  );
}