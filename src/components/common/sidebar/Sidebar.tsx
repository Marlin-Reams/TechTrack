import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import {
    BarChart3,
    BookOpen,
    Car,
    ChevronDown,
    ChevronRight,
    DollarSign,
    LayoutDashboard,
    Menu,
    Bell,
    Settings,
    Wrench,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {

    const mobileQuery = "(max-width: 700px)";
    const [isMobile, setIsMobile] = useState(() => window.matchMedia(mobileQuery).matches);

    const [collapsed, setCollapsed] =
        useState(() => window.matchMedia(mobileQuery).matches);

    useEffect(() => {
        const media = window.matchMedia(mobileQuery);
        const handleChange = (event: MediaQueryListEvent) => {
            setIsMobile(event.matches);
            setCollapsed(event.matches);
        };
        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, []);

    const closeMobileMenu = () => {
        if (isMobile) setCollapsed(true);
    };

    const [repairsOpen, setRepairsOpen] =
        useState(true);

    const [financialOpen, setFinancialOpen] =
        useState(true);

    return (

        <nav
            className={
                collapsed
                    ? "sidebar collapsed"
                    : "sidebar"
            }
            aria-label="Primary navigation"
        >

            <button
                className="sidebar-toggle"
                onClick={() =>
                    setCollapsed(!collapsed)
                }
                aria-label={collapsed ? "Open navigation" : "Close navigation"}
            >
                <Menu size={24} />
            </button>

            <ul>

                <li>

                    <NavLink to="/" onClick={closeMobileMenu}>

                        <LayoutDashboard size={20} />

                        {!collapsed && (
                            <span>Dashboard</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <button
                        className="sidebar-group"
                        onClick={() =>
                            setRepairsOpen(!repairsOpen)
                        }
                    >

                        <div className="sidebar-group-left">

                            <Wrench size={20} />

                            {!collapsed && (
                                <span>Repairs</span>
                            )}

                        </div>

                        {!collapsed && (

                            repairsOpen
                                ? <ChevronDown size={18} />
                                : <ChevronRight size={18} />

                        )}

                    </button>

                    {!collapsed && repairsOpen && (

                        <ul>

                            <li>
                                <NavLink to="/repairs/scan" onClick={closeMobileMenu}>
                                    📷 Scan Repair Order
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/repairs/new" onClick={closeMobileMenu}>
                                    New Repair
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/repairs/work" onClick={closeMobileMenu}>
                                    Work In Progress
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/repairs/history" onClick={closeMobileMenu}>
                                    Repair History
                                </NavLink>
                            </li>

                        </ul>

                    )}

                </li>

                <li>

                    <NavLink to="/vehicles" onClick={closeMobileMenu}>

                        <Car size={20} />

                        {!collapsed && (
                            <span>Vehicles</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <NavLink to="/knowledge" onClick={closeMobileMenu}>

                        <BookOpen size={20} />

                        {!collapsed && (
                            <span>Knowledge Base</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <button
                        className="sidebar-group"
                        onClick={() =>
                            setFinancialOpen(!financialOpen)
                        }
                    >

                        <div className="sidebar-group-left">

                            <DollarSign size={20} />

                            {!collapsed && (
                                <span>Financial</span>
                            )}

                        </div>

                        {!collapsed && (

                            financialOpen
                                ? <ChevronDown size={18} />
                                : <ChevronRight size={18} />

                        )}

                    </button>

                    {!collapsed && financialOpen && (

                        <ul>

                            <li>
                                <NavLink to="/financial" end onClick={closeMobileMenu}>
                                    Dashboard
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/financial/paystubs" onClick={closeMobileMenu}>
                                    Paystubs
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/payroll-verification" onClick={closeMobileMenu}>
                                    Payroll Review
                                </NavLink>
                            </li>

                        </ul>

                    )}

                </li>

                <li>

                    <NavLink to="/reports" onClick={closeMobileMenu}>

                        <BarChart3 size={20} />

                        {!collapsed && (
                            <span>Reports</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <NavLink to="/labor-library" onClick={closeMobileMenu}>

                        <Settings size={20} />

                        {!collapsed && (
                            <span>Labor Library</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <NavLink to="/reminders" onClick={closeMobileMenu}>
                        <Bell size={20} />
                        {!collapsed && (<span>Notes & Reminders</span>)}
                    </NavLink>

                </li>

                <li>

                    <NavLink to="/settings" onClick={closeMobileMenu}>

                        <Settings size={20} />

                        {!collapsed && (
                            <span>Settings</span>
                        )}

                    </NavLink>

                </li>

            </ul>

        </nav>

    );

}
