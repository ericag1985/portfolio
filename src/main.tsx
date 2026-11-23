import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './design-system/tokens/tokens.css';
import { App } from './site/App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root is missing from the document.');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
