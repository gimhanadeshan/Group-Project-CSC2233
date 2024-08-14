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
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700 shadow-md">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-start rtl:justify-end">
                    <button
                        onClick={toggleSidebar}
                        type="button"
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Open sidebar</span>
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
                <div className="relative flex items-center ">
                    <div className="flex items-center ms-3">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <div>
                                    <button
                                        type="button"
                                        className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 transition-transform transform hover:scale-105"
                                        aria-expanded={userDropdownOpen}
                                        onClick={toggleUserDropdown}
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src={
                                                user.profile_img
                                                    ? "/profile_photos/" + user.profile_img
                                                    : "/profile_photos/default-profile-image.png"
                                            }
                                            alt="userPhoto"
                                        />
                                    </button>
                                </div>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
    <div
        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg dark:bg-gray-700 z-50 flex flex-col"
        id="dropdown-user"
    >
        <div className="px-4 py-4 flex flex-col items-center justify-center">
            <img
                className="w-12 h-12 rounded-full shadow-md ring-4 ring-gray-300 dark:ring-gray-600 transition-transform transform hover:scale-105"
                src={
                    user.profile_img
                        ? "/profile_photos/" + user.profile_img
                        : "/profile_photos/default-profile-image.png"
                }
                alt="userPhoto"
            />
            <p className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">
                {user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-300">
                {user.email}
            </p>
        </div>
        <ul className="py-2 flex flex-col">
            <li>
                <Dropdown.Link
                    href={route("dashboard")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white transition-colors flex items-center"
                >
                    <svg
                        className="w-5 h-5 mr-2 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m-4-4v4h4m6 0v-4m0 4h4m-4-4v4"
                        ></path>
                    </svg>
                    Dashboard
                </Dropdown.Link>
            </li>
            <li>
                <Dropdown.Link
                    href={route("profile.edit")}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white transition-colors flex items-center"
                >
                    <svg
                        className="w-5 h-5 mr-2 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 1c2.761 0 5 2.239 5 5 0 .873-.227 1.696-.626 2.418l1.26 1.26C17.786 10.696 18 9.873 18 9c0-2.761-2.239-5-5-5-.873 0-1.696.227-2.418.626l1.26 1.26A4.992 4.992 0 0112 1zM12 23c-2.761 0-5-2.239-5-5 0-.873.227-1.696.626-2.418l-1.26-1.26C6.214 14.304 6 15.127 6 16c0 2.761 2.239 5 5 5 .873 0 1.696-.227 2.418-.626l-1.26-1.26A4.992 4.992 0 0112 23zM1 12c0-2.761 2.239-5 5-5 .873 0 1.696.227 2.418.626l1.26-1.26C7.786 5.304 7 6.127 7 7c0 2.761 2.239 5 5 5 .873 0 1.696-.227 2.418-.626l-1.26-1.26C14.304 10.214 15.127 10 16 10c2.761 0 5 2.239 5 5 0 .873-.227 1.696-.626 2.418l1.26 1.26C22.696 17.786 23 16.873 23 16c0-2.761-2.239-5-5-5-.873 0-1.696.227-2.418.626l-1.26-1.26C15.696 8.227 16 7.304 16 6c0-2.761-2.239-5-5-5-.873 0-1.696.227-2.418.626l-1.26-1.26C8.304 1.786 7.873 1 7 1c-2.761 0-5 2.239-5 5 0 .873.227 1.696.626 2.418l-1.26 1.26C1.786 7.696 1 6.873 1 6c0-2.761 2.239-5 5-5 .873 0 1.696.227 2.418.626l1.26 1.26C7.304 1.786 7 1.873 7 1 2.239 1 1 3.239 1 6c0 .873.227 1.696.626 2.418l-1.26 1.26C1.786 7.696 1 6.873 1 6z"
                        ></path>
                    </svg>
                    Settings
                </Dropdown.Link>
            </li>
            <li>
                <Dropdown.Link
                    href={route("logout")}
                    method="post"
                    as="button"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white transition-colors flex items-center"
                >
                    <svg
                        className="w-5 h-5 mr-2 opacity-70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 3l9 9m0 0l-9 9m9-9H3m3 9H3m6-12H3"
                        ></path>
                    </svg>
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
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
