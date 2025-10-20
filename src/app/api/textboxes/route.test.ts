import { describe, expect, it, vi, beforeEach } from 'vitest';
import { POST, GET, DELETE, textboxes} from './route';

describe('Textbox API Routes', () => {
    beforeEach(() => {
        // Reset in-memory storage before each test
        for (const key in textboxes) {
            delete textboxes[key];
        }
    });

    it('saves textbox content on POST', async () => {
        const request = new Request('http://localhost/api/textboxes', {
            method: 'POST',
            body: JSON.stringify({ id: '1', content: 'This is a test' }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(data.success).toBe(true);
        expect(textboxes['1']).toBe('This is a test');
    });

    it('retrieves empty array on GET when no textboxes', async () => {
        const response = await GET();
        const data = await response.json();

        expect(data).toEqual([]);
    });

    it('retrieves all textboxes on GET', async () => {
        // Pre-populate textboxes
        textboxes['1'] = 'This is a test';
        textboxes['2'] = 'This is another test';

        const response = await GET();
        const data = await response.json();

        expect(data).toEqual([
            { id: 1, content: 'This is a test' },
            { id: 2, content: 'This is another test' },
        ]);
    });

    it('deletes a textbox on DELETE', async () => {
        // Pre-populate textboxes
        textboxes['1'] = 'This is a test';
        textboxes['2'] = 'This is another test';
        textboxes['3'] = 'This is yet another test';

        const request = new Request('http://localhost/api/textboxes', {
            method: 'DELETE',
            body: JSON.stringify({ id: '2' }),
        });

        const response = await DELETE(request);
        const data = await response.json();

        expect(data.success).toBe(true);
        expect(textboxes['2']).toBeUndefined();
        expect(textboxes['1']).toBe('This is a test');
        expect(textboxes['3']).toBe('This is yet another test');
    });

    it('returns 404 on DELETE for non-existent textbox', async () => {
        const request = new Request('http://localhost/api/textboxes', {
            method: 'DELETE',
            body: JSON.stringify({ id: '999' }),
        });

        const response = await DELETE(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.error).toBe("Textbox not found.");
    });
});