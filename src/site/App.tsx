import { Portfolio } from './Portfolio';
import { useTheme } from './useTheme';

export function App() {
  const { theme, toggle } = useTheme();

  return <Portfolio theme={theme} onToggleTheme={toggle} />;
}
