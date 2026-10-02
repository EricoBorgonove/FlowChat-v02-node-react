import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendToAI } from './api';

describe('sendToAI', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns the assistant message sent by the backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ success: true, message: 'Resposta da IA' }),
      })),
    );

    await expect(sendToAI('Oi', 'session-1')).resolves.toBe('Resposta da IA');
  });
});
