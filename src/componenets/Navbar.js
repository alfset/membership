import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <ul className="flex space-x-4">
        <li><Link href="/admin">Admin</Link></li>
        <li><Link href="/qr">Generate QR</Link></li>
        <li><Link href="/scan">Scan QR</Link></li>
      </ul>
    </nav>
  );
}