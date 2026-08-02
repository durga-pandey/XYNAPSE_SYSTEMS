import { useTheme } from "../context/ThemeContext";
import "./ThemeToggle.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-container">
      <input
        type="checkbox"
        id="theme-switch"
        className="theme-toggle-checkbox"
        checked={theme === "dark"}
        onChange={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      />
      <label htmlFor="theme-switch" className="theme-toggle-label">
        <span className="toggle-icon sun-icon">☀️</span>
        <span className="toggle-icon moon-icon">🌙</span>
        <div className="toggle-circle"></div>
      </label>
    </div>
  );
}

export default ThemeToggle;
