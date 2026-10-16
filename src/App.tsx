'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');
  const { error, messages, sendMessage, status } = useChat({
    id: 'example-chat',
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <>
      {messages.map(message => (
        <div key={message.id}>
          <strong>{message.role === 'user' ? 'You: ' : 'AI: '}</strong>
          {message.parts.map((part, index) => {
            if (part.type === 'text') {
              return <span key={index}>{part.text}</span>;
            }

            if (part.type.startsWith('tool-') || part.type === 'dynamic-tool') {
              return <pre key={index}>{JSON.stringify(part, null, 2)}</pre>;
            }

            return null;
          })}
        </div>
      ))}

      {error && <div>{error.message}</div>}

      <form
        onSubmit={event => {
          event.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <input
          value={input}
          onChange={event => setInput(event.target.value)}
          disabled={status !== 'ready'}
        />
        <button type="submit" disabled={status !== 'ready'}>
          Send
        </button>
      </form>
    </>
  );
}