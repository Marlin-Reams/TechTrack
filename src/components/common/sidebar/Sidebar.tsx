import { useState } from "react";
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
    Settings,
    Wrench,
} from "lucide-react";

import "./Sidebar.css";

export default function Sidebar() {

    const [collapsed, setCollapsed] =
        useState(false);

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
        >

            <button
                className="sidebar-toggle"
                onClick={() =>
                    setCollapsed(!collapsed)
                }
            >
                <Menu size={24} />
            </button>

            <ul>

                <li>

                    <NavLink to="/">

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
                                <NavLink to="/repairs/new">
                                    New Repair
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/repairs/work">
                                    Work In Progress
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/repairs/history">
                                    Repair History
                                </NavLink>
                            </li>

                        </ul>

                    )}

                </li>

                <li>

                    <NavLink to="/vehicles">

                        <Car size={20} />

                        {!collapsed && (
                            <span>Vehicles</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <NavLink to="/knowledge">

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
                                <NavLink to="/financial">
                                    Dashboard
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/financial/paystubs">
                                    Paystubs
                                </NavLink>
                            </li>

                        </ul>

                    )}

                </li>

                <li>

                    <NavLink to="/reports">

                        <BarChart3 size={20} />

                        {!collapsed && (
                            <span>Reports</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <NavLink to="/labor-library">

                        <Settings size={20} />

                        {!collapsed && (
                            <span>Labor Library</span>
                        )}

                    </NavLink>

                </li>

                <li>

                    <NavLink to="/settings">

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