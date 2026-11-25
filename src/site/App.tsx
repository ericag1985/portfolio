import { Portfolio } from './components/Portfolio';
import { useTheme } from './hooks/useTheme';

export function App() {
  const { theme, toggle } = useTheme();

  return <Portfolio theme={theme} onToggleTheme={toggle} />;
}
