import Link from "next/link";
import Image from "next/image";
const Header = () => {
  return (
    <header className="bg-[#0071bc] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold">
          Cabinet Lee Management
        </Link>
        <Image
          className="rounded-full"
          src="/logoLee.png"
          height={50}
          width={50}
          alt="Logo Lee"
        />
      </div>
    </header>
  );
};

export default Header;
