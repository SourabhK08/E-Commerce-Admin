import { Menu } from "lucide-react";
import LogoutButton from "../LogoutButton";
import ThemeToggle from "../ThemeToggle";
import { usePathname } from "next/navigation";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("products")) return "Products";
    if (pathname.includes("orders")) return "Orders";
    if (pathname.includes("users")) return "Users";
    return "Dashboard";
  };

  return (
    <header className="bg-gray-200 dark:bg-gray-900 h-16 flex items-center justify-between px-6 border-b dark:border-gray-700">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden">
          <Menu size={22} />
        </button>

        <h1 className="text-lg font-semibold">{getTitle()}</h1>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </header>
  );
}
