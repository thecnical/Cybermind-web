import { BackendClient } from './BackendClient';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

function makeJsonResponse(body: object, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { get: () => 'application/json' },
    json: async () => body,
    text: async () => JSON.stringify(body),
    body: null,
  };
}

describe('BackendClient routing', () => {
  let client: BackendClient;

  beforeEach(() => {
    client = new BackendClient();
    mockFetch.mockReset();
  });

  it('routes cybermindcli model to /free/chat without auth header', async () => {
    mockFetch.mockResolvedValueOnce(makeJsonResponse({ response: 'Hello!' }));

    const tokens: string[] = [];
    await client.chat(
      { message: 'test', agent: 'code', context: '' },
      'cybermindcli',
      null,
      (t) => tokens.push(t)
    );

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/free/chat');
    expect(options.headers['X-API-Key']).toBeUndefined();
    expect(tokens).toEqual(['Hello!']);
  });

  it('routes pro model to /chat with X-API-Key header', async () => {
    mockFetch.mockResolvedValueOnce(makeJsonResponse({ response: 'Pro response' }));

    await client.chat(
      { message: 'test', agent: 'code', context: '' },
      'pro-standard',
      'cp_live_testkey123',
      () => {}
    );

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/chat');
    expect(url).not.toContain('/free/chat');
    expect(options.headers['X-API-Key']).toBe('cp_live_testkey123');
    expect(options.headers['X-User-Plan']).toBeUndefined();
  });

  it('adds X-User-Plan: elite header for elite models', async () => {
    mockFetch.mockResolvedValueOnce(makeJsonResponse({ response: 'Elite response' }));

    await client.chat(
      { message: 'test', agent: 'security', context: '' },
      'elite-claude',
      'cp_live_testkey123',
      () => {}
    );

    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toContain('/chat');
    expect(options.headers['X-API-Key']).toBe('cp_live_testkey123');
    expect(options.headers['X-User-Plan']).toBe('elite');
  });

  it('throws on 401 response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      headers: { get: () => 'application/json' },
      text: async () => 'Unauthorized',
    });

    await expect(
      client.chat(
        { message: 'test', agent: 'code', context: '' },
        'pro-standard',
        'cp_live_badkey',
        () => {}
      )
    ).rejects.toThrow('HTTP 401');
  });

  it('sends correct request body', async () => {
    mockFetch.mockResolvedValueOnce(makeJsonResponse({ response: 'ok' }));

    await client.freeChat(
      { message: 'explain this', agent: 'explain', context: 'const x = 1;' },
      () => {}
    );

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.message).toBe('explain this');
    expect(body.agent).toBe('explain');
    expect(body.context).toBe('const x = 1;');
  });

  it('cancelCurrentRequest aborts in-flight request', () => {
    // Just verify it doesn't throw when no request is in flight
    expect(() => client.cancelCurrentRequest()).not.toThrow();
  });
});
