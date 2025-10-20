import { describe, expect, it, vi, beforeEach, type Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from './page';
import { fireEvent } from '@testing-library/dom';

describe('Home', () => {

    beforeEach(() => {
        // Completely mock fetch for each test
        global.fetch = vi.fn((url: string, options?: any) => {
        if (options?.method === "POST") {
            return Promise.resolve({
                json: () => Promise.resolve({}),
            } as Response);
        } else {
            // GET request
            return Promise.resolve({
                json: () => Promise.resolve([]),
            } as Response);
        }}) as unknown as typeof fetch;
    });

    it('renders header and new text button', () => {
        render(<Home />);
        const headerButton = screen.getByRole('button', { name: '+ Text Box' });
        expect(headerButton).toBeInTheDocument();
    });

    it('fetches and displays textboxes', async () => {
        const mockTextboxes = [
            { id: 1, content: 'First textbox' },
            { id: 2, content: 'Second textbox' },
        ];

        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockTextboxes,
        } as Response);

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('First textbox')).toBeInTheDocument();
            expect(screen.getByText('Second textbox')).toBeInTheDocument();
        });
    });

    it('generates a new textbox when NewTextButton is clicked', async () => {
        global.fetch = vi.fn().mockResolvedValue({ok: true, json: async () => []});

        render(<Home />);

        const newTextButton = screen.getByRole('button', { name: '+ Text Box' });
        await userEvent.click(newTextButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/textboxes', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining('"content":""'),
            }));
        });

        // Check if new textbox is rendered
        const textboxes = screen.getAllByRole('textbox');
        expect(textboxes.length).toBe(1);
        expect(textboxes[0]).toHaveValue('');

    });

    it('generates multiple textboxes when NewTextButton is clicked multiple times with existing textboxes', async () => {
        const mockTextboxes = [
            { id: 1, content: 'Existing textbox' },
        ];

        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockTextboxes,
        } as Response);

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('Existing textbox')).toBeInTheDocument();
        });

        global.fetch = vi.fn().mockResolvedValue({ok: true, json: async () => []});

        const newTextButton = screen.getByRole('button', { name: '+ Text Box' });
        await userEvent.click(newTextButton);
        await userEvent.click(newTextButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });

        // Check if new textboxes are rendered
        const textboxes = screen.getAllByRole('textbox');
        expect(textboxes.length).toBe(3); //
    });

    it('deletes a textbox when delete button is clicked', async () => {
        const mockTextboxes = [
            { id: 1, content: 'This is a test' },
            { id: 2, content: 'This is another test' },
        ];

        (global.fetch as Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockTextboxes,
        } as Response);

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText('This is a test')).toBeInTheDocument();
            expect(screen.getByText('This is another test')).toBeInTheDocument();
        });

        global.fetch = vi.fn().mockResolvedValue({ ok: true });

        const deleteButtons = screen.getAllByRole('button', { name: 'X' });
        await userEvent.click(deleteButtons[0]); // Delete first textbox

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/textboxes', expect.objectContaining({
                method: 'DELETE',
                body: expect.stringContaining('"id":1'),
            }));
        });

        // Check if textbox is removed
        await waitFor(() => {
            expect(screen.queryByText('This is a test')).not.toBeInTheDocument();
            expect(screen.getByText('This is another test')).toBeInTheDocument();
        });
    });

    it('create two new textboxes after another and ensure unique IDs', async () => {
        global.fetch = vi.fn().mockResolvedValue({ok: true, json: async () => []});

        render(<Home />);

        const newTextButton = screen.getByRole('button', { name: '+ Text Box' });
        await userEvent.click(newTextButton);
        await userEvent.click(newTextButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(3);
            // Check that the body contains unique IDs by comparing the calls
            const firstCallBody = JSON.parse((global.fetch as Mock).mock.calls[1][1].body);
            const secondCallBody = JSON.parse((global.fetch as Mock).mock.calls[2][1].body);
            expect(firstCallBody.id).not.toBe(secondCallBody.id);
        }
        );
    });

    it('handles long textbox content', async () => {
        const longContent = 'A'.repeat(10000);
        render(<Home />);

        const newTextButton = screen.getByRole('button', { name: '+ Text Box' });
        await userEvent.click(newTextButton);

        const textbox = screen.getByRole('textbox');
        fireEvent.change(textbox, { target: { value: longContent } });
        await userEvent.type(textbox, 'BBB');

        const expectedContent = longContent + 'BBB';


        await waitFor(() => {
            expect(textbox).toHaveValue(expectedContent);

            expect(global.fetch).toHaveBeenCalledWith('/api/textboxes', expect.objectContaining({
                method: 'POST',
                body: expect.stringContaining(expectedContent),
            }));
        }, { timeout: 2000 });
    });

});