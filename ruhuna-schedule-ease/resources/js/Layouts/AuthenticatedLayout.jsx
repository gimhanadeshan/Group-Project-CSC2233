import { useState, useEffect } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link } from "@inertiajs/react";
import Sidebar from "@/Components/Sidebar";

export default function Authenticated({ user, header, children, permissions }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    useEffect(() => {
        //console.log("User data:", user);
    }, [user]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen);
    };

    return (
        <>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-3 py-3 lg:px-5 lg:pl-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start rtl:justify-end">
                                <button
                                    onClick={toggleSidebar}
                                    type="button"
                                    className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                >
                                    <span className="sr-only">
                                        Open sidebar
                                    </span>
                                    <svg
                                        className="w-6 h-6"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            fillRule="evenodd"
                                            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                                        ></path>
                                    </svg>
                                </button>
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>
                            <div className="relative flex items-center">
                                <div className="flex items-center ms-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <div>
                                                <button
                                                    type="button"
                                                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                                    aria-expanded={
                                                        userDropdownOpen
                                                    }
                                                    onClick={toggleUserDropdown}
                                                >
                                                    <span className="sr-only">
                                                        Open user menu
                                                    </span>
                                                    <img
                                                        className="w-8 h-8 rounded-full"
                                                        src={
                                                            user.profile_img
                                                                ? "/profile_photos/" +
                                                                  user.profile_img
                                                                : "/profile_photos/default-profile-image.png"
                                                        }
                                                        alt="userPhoto"
                                                    />
                                                </button>
                                            </div>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <div
                                                className="right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600 z-50"
                                                id="dropdown-user"
                                            >
                                                <div
                                                    className="px-4 py-3"
                                                    role="none"
                                                >
                                                    <p
                                                        className="text-sm text-gray-900 dark:text-white"
                                                        role="none"
                                                    >
                                                        {user.name}
                                                    </p>
                                                    <p
                                                        className="text-sm font-medium text-gray-900 truncate dark:text-gray-300"
                                                        role="none"
                                                    >
                                                        {user.registration_no}
                                                    </p>
                                                </div>
                                                <ul
                                                    className="py-1"
                                                    role="none"
                                                >
                                                    <li>
                                                        <Dropdown.Link
                                                            href={route(
                                                                "dashboard"
                                                            )}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            role="menuitem"
                                                        >
                                                            Dashboard
                                                        </Dropdown.Link>
                                                    </li>
                                                    <li>
                                                        <Dropdown.Link
                                                            href={route(
                                                                "profile.edit"
                                                            )}
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            role="menuitem"
                                                        >
                                                            Settings
                                                        </Dropdown.Link>
                                                    </li>

                                                    <li>
                                                        <Dropdown.Link
                                                            href={route(
                                                                "logout"
                                                            )}
                                                            method="post"
                                                            as="button"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                                            role="menuitem"
                                                        >
                                                            Sign out
                                                        </Dropdown.Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <aside
                    id="logo-sidebar"
                    className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
                        sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
                    aria-label="Sidebar"
                >
                    <Sidebar permissions={permissions} />
                </aside>

                <div className="p-4 sm:ml-64 mt-16">
                    {header && (
                        <header className="bg-white shadow">
                            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    <main className="flex-grow">{children}</main>
                </div>
            </div>
        </>
    );
}
