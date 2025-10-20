import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './Header';


describe('Header', () => {
    it('renders header with NewTextButton', () => {
        render(<Header onAdd={() => {}} />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('+ Text Box');
    });

    it('calls onAdd when NewTextButton is clicked', async () => {
        const onAddMock = vi.fn();
        render(<Header onAdd={onAddMock} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(onAddMock).toHaveBeenCalled();
    });
})