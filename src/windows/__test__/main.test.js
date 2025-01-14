import React from 'react';
import { createRoot } from 'react-dom/client';
import { act, waitFor } from '@testing-library/react';
import { setupMock, teardownMock } from '../../mock.setup';

import MainWindow from '../main';

jest.mock('../../components/tabs/history', () => function () {
	return <mock-modal data-testid="modal" />;
});
jest.mock('../../components/tabs/help', () => function () {
	return <mock-modal data-testid="modal" />;
});
jest.mock('../../components/tabs/settings', () => function () {
	return <mock-modal data-testid="modal" />;
});
jest.mock('../../components/tabs/extensions', () => function () {
	return <mock-modal data-testid="modal" />;
});

let ready = false;
let container = null;
let root = null;
beforeEach(async () => {
	container = document.createElement('div');
	root = createRoot(container);

	setupMock((cmd, args) => {
		if (args.message && args.message.event === 'ready') {
			ready = true;
		}
	});

	await act(async () => {
		root.render(<MainWindow />);
	});
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
	container = null;
	ready = false;
	teardownMock();
});

it('renders', async () => {
	await act(async () => {
		root.render(<MainWindow />);
	});

	await waitFor(() => expect(ready).toBe(true));
});
