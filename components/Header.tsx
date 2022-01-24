import Link from "next/link";

export default function Header() {

  return (<header className="flex items-center justify-between px-4 max-w-7xl mx-auto">
      <div>
        <Link href="/">
            <img className="w-20 cursor-pointer" src="/logo.png" alt="Logo" />
        </Link>

      </div>
      <div className="space-x-5">
          <Link href="/about"><a className="text-white bg-[#f03e2f] py-2 text-sm px-4 hover:bg-red-800 rounded-3xl">About</a></Link>
          <Link href="/about"><a className="text-white bg-[#f03e2f] py-2 text-sm px-4 hover:bg-red-800 rounded-3xl">Contact</a></Link>
      </div>
  </header>);

}
