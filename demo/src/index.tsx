import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { Demo } from './Demo';

createRoot(document.getElementById('root') as HTMLElement).render(
	<StrictMode>
		<Demo />
	</StrictMode>,
);
