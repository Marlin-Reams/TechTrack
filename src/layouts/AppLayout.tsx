import { Link, Outlet } from "react-router-dom";
import { logout } from "../features/auth/services/authService";

async function handleLogout() {
  await logout();
}

function AppLayout() {
  return (
  <div>
    <header>
      <h1>TechTrack</h1>

      <button onClick={handleLogout}>
        Sign Out
      </button>
    </header>

    <nav>
      <Link to="/">Dashboard</Link>
    </nav>

    <main>
      <Outlet />
    </main>
  </div>
);
}

export default AppLayout;