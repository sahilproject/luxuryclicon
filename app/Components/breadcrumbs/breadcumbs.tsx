"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineHome } from "react-icons/ai";

const Breadcrumbs = () => {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean); 

  const getHref = (index: number) => {
    return "/" + segments.slice(0, index + 1).join("/");
  };

  return (
    <nav className="text-sm text-gray-500 py-4">
      <ul className="flex items-center space-x-1">
        <li className="flex items-center">
          <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
            <AiOutlineHome /> Home
          </Link>
        </li>

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const href = getHref(index);

          const label =
            segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

          return (
            <li key={index} className="flex items-center space-x-1">
              <span className="px-2">{">"}</span>
              {isLast ? (
                <span className="text-blue-600">{label}</span>
              ) : (
                <Link href={href} className="hover:text-blue-600">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
