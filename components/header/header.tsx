"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const { isSignedIn } = useAuth();
  const [checked, setChecked] = useState(
    typeof window !== "undefined" && localStorage?.getItem("theme") === "dark"
      ? true
      : false
  );
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    localStorage.setItem("theme", e.target.checked ? "dark" : "light");
    themeChange(false);
  };

  return (
    <header className="navbar bg-base-100 p-2 md:p-4">
      <input
        data-toggle-theme="dark,light"
        data-act-class="ACTIVECLASS"
        type="checkbox"
        className="toggle toggle-primary"
        checked={checked}
        onChange={handleThemeChange}
      />
      <div className="flex-1">
        <Link
          href="/"
          className="btn btn-ghost normal-case text-base md:text-lg"
        >
          subaway
        </Link>
      </div>
      <div className="flex space-x-2">
        {!isSignedIn && (
          <Link
            href="https://caring-ocelot-51.accounts.dev/sign-in"
            className="btn btn-primary normal-case text-base md:text-lg"
          >
            Sign in
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  );
};

export default Header;
