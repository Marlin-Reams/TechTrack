import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>

        <li>
          <Link to="/repairs">Repairs</Link>
        </li>

        <li>
          <Link to="/vehicles">Vehicles</Link>
        </li>

        <li>
          <Link to="/knowledge">Knowledge</Link>
        </li>

        <li>
          <Link to="/financials">Financials</Link>
        </li>

        <li>
          <Link to="/reports">Reports</Link>
        </li>

        <li>
          <Link to="/settings">Settings</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;