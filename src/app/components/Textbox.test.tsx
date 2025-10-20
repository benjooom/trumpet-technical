import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Textbox from './Textbox';


describe('Textbox', () => {
    it('renders textbox correctly', () => {
        render(<Textbox id={1} initialValue="This is a test" onDelete={() => {}} />);

        const textbox = screen.getByRole('textbox');
        expect(textbox).toBeInTheDocument();
        expect(textbox).toHaveTextContent('This is a test');

        const deleteButton = screen.getByRole('button');
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveTextContent('X');
    });

    it('calls onDelete when delete button is clicked', async () => {
        const onDeleteMock = vi.fn();
        global.fetch = vi.fn().mockResolvedValue({ ok: true });

        render(<Textbox id={1} initialValue="This is a test" onDelete={onDeleteMock} />);

        const deleteButton = screen.getByRole('button');
        await userEvent.click(deleteButton);

        expect(onDeleteMock).toHaveBeenCalledWith(1);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/textboxes', expect.objectContaining({
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 1 }),
            }));
        });
    });

    it('updates textarea value on change', async () => {
        render(<Textbox id={1} initialValue="This is a test" onDelete={() => {}} />);

        const textbox = screen.getByRole('textbox');
        await userEvent.clear(textbox);
        await userEvent.type(textbox, 'New text content');

        expect(textbox).toHaveValue('New text content');
    });

    it('saves content to store after debounce', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true });

        render(<Textbox id={1} initialValue="This is a test" onDelete={() => {}} />);

        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'Updated content');

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/textboxes', expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: 1, content: 'This is a testUpdated content' }),
            }));
        }, { timeout: 2000 });
    });

    it('does not save content if unchanged', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true });
        render(<Textbox id={1} initialValue="This is a test" onDelete={() => {}} />);

        await waitFor(() => {
            expect(global.fetch).not.toHaveBeenCalled();
        }, { timeout: 2000 });
    });

    it('cancels save if theres a new change within debounce period', async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true });

        render(<Textbox id={1} initialValue="This is a test" onDelete={() => {}} />);

        const textbox = screen.getByRole('textbox');
        await userEvent.type(textbox, 'First change');

        // Type again before debounce period ends
        await new Promise((r) => setTimeout(r, 500));
        await userEvent.type(textbox, ' Second change');

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        }, { timeout: 2000 });

        expect(global.fetch).toHaveBeenCalledWith('/api/textboxes', expect.objectContaining({
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: 1, content: 'This is a testFirst change Second change' }),
        }));
    });
})