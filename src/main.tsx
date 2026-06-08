import { createRoot } from 'react-dom/client';

import { App, Providers } from '@/app';

import '@mantine/core/styles.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <Providers>
    <App />
  </Providers>
);
