import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NewTextButton from './NewTextButton';
import userEvent from '@testing-library/user-event';


describe('NewTextButton', () => {
    it('renders button with correct text', () => {
        render(<NewTextButton onAdd={() => {}} />);

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('+ Text Box');
    });

    it('calls onAdd when button is clicked', async () => {
        const onAddMock = vi.fn();
        render(<NewTextButton onAdd={onAddMock} />);

        const button = screen.getByRole('button');
        await userEvent.click(button);

        expect(onAddMock).toHaveBeenCalled();
    });
})
