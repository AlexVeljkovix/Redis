import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useAuth } from "../context/AuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const getNavigation = () => {
    const baseNav = [
      { name: "Events", href: "/events" },
      { name: "Locations", href: "/locations" },
    ];

    if (isAuthenticated() && !isAdmin()) {
      baseNav.push({ name: "My Reservations", href: "/reservations" });
    }

    if (isAdmin()) {
      baseNav.push({ name: "All Reservations", href: "/reservations" });
      baseNav.push({ name: "All Users", href: "/users" });
    }

    return baseNav;
  };

  const navigation = getNavigation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Disclosure
      as="nav"
      className="relative bg-linear-to-br from-indigo-600 to-purple-600"
    >
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 right-0 flex items-center sm:hidden px-2">
            <DisclosureButton className="mr-2 group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
              <span className="sr-only">Open main menu</span>
              <Bars3Icon
                aria-hidden="true"
                className="block h-6 w-6 group-data-open:hidden"
              />
              <XMarkIcon
                aria-hidden="true"
                className="hidden h-6 w-6 group-data-open:block"
              />
            </DisclosureButton>

            <div className="flex-1 pr-2">
              <SearchBar />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={classNames(
                        isActive
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white",
                        "rounded-md px-3 py-2 text-lg font-bold"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-5">
            <div className="max-w-52">
              <SearchBar />
            </div>

            {isAuthenticated() ? (
              <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20 transition">
                  <UserCircleIcon className="h-6 w-6" />
                  <span className="font-medium">{user?.name}</span>
                  {isAdmin() && (
                    <ShieldCheckIcon className="h-5 w-5 text-yellow-300" />
                  )}
                </MenuButton>
                <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-indigo-600 font-semibold mt-1">
                      {user?.role}
                    </p>
                  </div>
                  <MenuItem>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "block px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        My Profile
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={classNames(
                          active ? "bg-gray-100" : "",
                          "flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700"
                        )}
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        Logout
                      </button>
                    )}
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-gray-100 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden px-2 pt-2 pb-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <DisclosureButton
                key={item.name}
                as={Link}
                to={item.href}
                className={classNames(
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white",
                  "block rounded-md px-3 py-2 text-lg font-bold"
                )}
              >
                {item.name}
              </DisclosureButton>
            );
          })}

          {isAuthenticated() ? (
            <>
              <div className="border-t border-white/10 my-2"></div>
              <div className="px-3 py-2">
                <p className="text-white font-medium">{user?.name}</p>
                <p className="text-gray-300 text-sm">{user?.email}</p>
                <p className="text-yellow-300 text-xs font-semibold mt-1">
                  {user?.role}
                </p>
              </div>
              <DisclosureButton
                as={Link}
                to="/profile"
                className="block rounded-md px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
              >
                My Profile
              </DisclosureButton>
              <button
                onClick={handleLogout}
                className="w-full text-left block rounded-md px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <DisclosureButton
              as={Link}
              to="/login"
              className="block rounded-md px-3 py-2 text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Login
            </DisclosureButton>
          )}
        </div>
      </DisclosurePanel>
    </Disclosure>
  );
}
