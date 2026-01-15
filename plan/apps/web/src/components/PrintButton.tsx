'use client';
export default function PrintButton() {
  return (
    <button className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition shadow-lg flex items-center gap-2" onClick={() => window.print()}>
        🖨️ Print Report
    </button>
  );
}