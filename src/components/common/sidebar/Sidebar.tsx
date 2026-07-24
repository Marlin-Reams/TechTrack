import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/">
                        Dashboard
                    </NavLink>
                </li>

                <li>
                    <strong>Repairs</strong>

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
                </li>

                <li>
                    <NavLink to="/vehicles">
                        Vehicles
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/knowledge">
                        Knowledge
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/financial">
                        Financials
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/reports">
                        Reports
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/settings">
                        Settings
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Sidebar;