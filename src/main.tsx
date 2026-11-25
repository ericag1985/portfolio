import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './component-lab/styles/normalize.css';
import './component-lab/tokens/tokens.css';
import { App } from './site/App';
import { applyTheme, initialTheme } from './site/theme';

applyTheme(initialTheme());

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root is missing from the document.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
