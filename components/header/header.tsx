"use client";

import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { themeChange } from "theme-change";

const Header = () => {
  const [checked, setChecked] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
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
    <header className="navbar bg-base-100">
      <input
        data-toggle-theme="dark,light"
        data-act-class="ACTIVECLASS"
        type="checkbox"
        className="toggle toggle-primary"
        checked={checked}
        onChange={handleThemeChange}
      />
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
      </div>

      <UserButton afterSignOutUrl="/" />
    </header>
  );
};

export default Header;
