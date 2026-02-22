import { render } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Root Component', () => {
    it('renders the main application routing without crashing', () => {
        // Render the root component that injects Router and AuthProvider
        const { container } = render(<App />);
        
        // Assert that the container correctly caught the DOM tree rendering
        expect(container).toBeTruthy();
        expect(container.firstChild).toBeDefined();
    });
});
