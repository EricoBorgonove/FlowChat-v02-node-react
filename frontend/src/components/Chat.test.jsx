// @vitest-environment jsdom
import {act} from 'react';
import {createRoot} from 'react-dom/client';
import {afterEach, describe, expect, it, vi} from 'vitest';
import Chat from './Chat';

describe('Chat', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('does not return scrollIntoView promise as an effect cleanup', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    const conversation = {
      messages: [
        {
          id: 'message-1',
          role: 'assistant',
          content: 'Resposta de teste',
          createdAt: Date.now(),
        },
      ],
    };

    Element.prototype.scrollIntoView = vi.fn(() => Promise.resolve());

    await act(async () => {
      root.render(<Chat conversation={conversation} loading={false} onSend={() => {}} />);
    });

    expect(() => {
      act(() => {
        root.unmount();
      });
    }).not.toThrow();
  });
});
