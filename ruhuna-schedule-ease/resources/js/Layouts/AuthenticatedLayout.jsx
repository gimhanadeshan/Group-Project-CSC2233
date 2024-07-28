import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import { Link } from "@inertiajs/react";

export default function Authenticated({ user, header, children, auth }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [sidebarDropdownOpen, setSidebarDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleUserDropdown = () => {
        setUserDropdownOpen(!userDropdownOpen);
    };
    const toggleSidebarDropdownOpen = () => {
        setSidebarDropdownOpen(!sidebarDropdownOpen);
    };

    let roleID = user.role_id;

    return (
        <>
            <div className="min-h-screen bg-gray-100">
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
                    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                        <ul className="space-y-2 font-medium">
                            <li>
                                <Link
                                    href={route("dashboard")}
                                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                >
                                    <svg
                                        className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 22 21"
                                    >
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    <span className="ms-3">Dashboard</span>
                                </Link>
                            </li>

                            {/* 

Filter according to role_Id 

*/}

                            {roleID == 1 && (
                                <>
                                    <li>
                                        <Link
                                            href={route("timetables.index")}
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        >
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 18 18"
                                            >
                                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8.000 1.857 8.000h4.286A1.857 1.857 0 0 0 8.000 6.143v-4.286A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10.000 1.857v4.286C10.000 7.169 10.831 8.000 11.857 8.000h4.286A1.857 1.857 0 0 0 18.000 6.143v-4.286A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0.000 11.857v4.286C0.000 17.169.831 18.000 1.857 18.000h4.286A1.857 1.857 0 0 0 8.000 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10.000 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18.000 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                            </svg>
                                            <span className="flex-1 ms-3 whitespace-nowrap">
                                                Time Table
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("semesters.index")}
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        >
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 18 18"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M12.512 8.72a2.46 2.46 0 0 1 3.479 0 2.461 2.461 0 0 1 0 3.479l-.004.005-1.094 1.08a.998.998 0 0 0-.194-.272l-3-3a1 1 0 0 0-.272-.193l1.085-1.1Zm-2.415 2.445L7.28 14.017a1 1 0 0 0-.289.702v2a1 1 0 0 0 1 1h2a1 1 0 0 0 .703-.288l2.851-2.816a.995.995 0 0 1-.26-.189l-3-3a.998.998 0 0 1-.19-.26Z"
                                                    clip-rule="evenodd"
                                                />
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M7 3a1 1 0 0 1 1 1v1h3V4a1 1 0 1 1 2 0v1h3V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Zm10.67 8H19v8H5v-8h3.855l.53-.537a1 1 0 0 1 .87-.285c.097.015.233.13.277.087.045-.043-.073-.18-.09-.276a1 1 0 0 1 .274-.873l1.09-1.104a3.46 3.46 0 0 1 4.892 0l.001.002A3.461 3.461 0 0 1 17.67 11Z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>

                                            <span className="flex-1 ms-3 whitespace-nowrap">
                                                Semesters
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            aria-controls="dropdown-example"
                                            onClick={toggleSidebarDropdownOpen}
                                        >
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 18"
                                            >
                                                <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                            </svg>
                                            <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">
                                                User Management
                                            </span>
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 18 18"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="m1 1 4 4 4-4"
                                                />
                                            </svg>
                                        </button>
                                        <ul
                                            id="dropdown-example"
                                            className={`${
                                                sidebarDropdownOpen
                                                    ? "block"
                                                    : "hidden"
                                            } py-2 space-y-2`}
                                        >
                                            <li>
                                                <Link
                                                    href={route("roles.index")}
                                                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                >
                                                    Roles
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route("users.index")}
                                                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                >
                                                    Users
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route(
                                                        "permissions.index"
                                                    )}
                                                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                >
                                                    Permissions
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route(
                                                        "degree-programs.index"
                                                    )}
                                                    class="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                                >
                                                    Degree Programs
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("lecture-halls.index")}
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        >
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 18 18"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M6 4h12M6 4v16M6 4H5m13 0v16m0-16h1m-1 16H6m12 0h1M6 20H5M9 7h1v1H9V7Zm5 0h1v1h-1V7Zm-5 4h1v1H9v-1Zm5 0h1v1h-1v-1Zm-3 4h2a1 1 0 0 1 1 1v4h-4v-4a1 1 0 0 1 1-1Z"
                                                />
                                            </svg>

                                            <span className="ms-3">
                                                Lecture Hall
                                            </span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={route("courses.index")}
                                            className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                        >
                                            <svg
                                                className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 18 18"
                                            >
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>

                                            <span className="ms-3">
                                                Courses
                                            </span>
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
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
