import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png"; // Adjust the relative path as necessary

const NavBar = () => {
  const navLinks = [
    { name: "Home", route: "/" },
    { name: "Instructors", route: "/instructors" },
    { name: "Classes", route: "/classes" },
  ];

  const [navBg, setNavBg] = useState("bg-[#15151580]");

  return (
    <nav className={`${navBg} w-[95%] mx-auto sm:px-6 lg:px-6`}>
      <div className="flex items-center justify-center py-4 px-4">
        {/* Logo Section */}
        <div>
          <h1 className="text-2xl inline-flex gap-3 items-center font-bold">
            YogaPlus
            <img className="w-8 h-8" src={logo} alt="Logo" />
          </h1>
          <p className="font-bold text-[13px] tracking-[8px]">Quick Explore</p>
        </div>
      </div>

      {/* Mobile menu icons */}
      {/* Add logic for mobile view menu here */}

      {/* Navigational Links */}
      <div className="hidden md:block text-black dark:text-white">
        <div className="flex">
          <ul className="ml-10 flex items-center space-x-4 pr-4">
            {navLinks.map((link) => (
              <li key={link.route}>
                <NavLink
                  to={link.route}
                  className={({ isActive }) =>
                    `font-bold ${
                      isActive
                        ? "text-secondary"
                        : navBg.includes("bg-transparent")
                        ? "text-white dark:text-white"
                        : "text-black dark:text-white"
                    } hover:text-secondary duration-300`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
