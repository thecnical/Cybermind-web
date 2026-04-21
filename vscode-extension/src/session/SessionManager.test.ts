import { SessionManager } from './SessionManager';

function makeMockMemento() {
  const store: Record<string, unknown> = {};
  return {
    get: jest.fn(<T>(key: string, defaultValue?: T): T => {
      return (store[key] as T) ?? (defaultValue as T);
    }),
    update: jest.fn(async (key: string, value: unknown) => {
      store[key] = value;
    }),
    keys: jest.fn(() => Object.keys(store)),
    _store: store,
  };
}

describe('SessionManager', () => {
  describe('createSession', () => {
    it('assigns a UUID and sets title to New Chat', () => {
      const manager = new SessionManager(makeMockMemento() as any);
      const session = manager.createSession('code', 'cybermindcli');

      expect(session.id).toMatch(/^[0-9a-f-]{36}$/);
      expect(session.title).toBe('New Chat');
      expect(session.agentId).toBe('code');
      expect(session.modelId).toBe('cybermindcli');
      expect(session.messages).toHaveLength(0);
    });

    it('sets title from first user message (truncated to 60 chars)', () => {
      const manager = new SessionManager(makeMockMemento() as any);
      manager.createSession('code', 'cybermindcli');

      const longMessage = 'A'.repeat(100);
      manager.addMessage({
        id: 'msg-1',
        role: 'user',
        content: longMessage,
        timestamp: Date.now(),
      });

      const session = manager.getCurrentSession();
      expect(session!.title).toHaveLength(60);
      expect(session!.title).toBe('A'.repeat(60));
    });

    it('sets title from first user message (short message)', () => {
      const manager = new SessionManager(makeMockMemento() as any);
      manager.createSession('code', 'cybermindcli');

      manager.addMessage({
        id: 'msg-1',
        role: 'user',
        content: 'How do I fix this bug?',
        timestamp: Date.now(),
      });

      const session = manager.getCurrentSession();
      expect(session!.title).toBe('How do I fix this bug?');
    });
  });

  describe('getAllSessions', () => {
    it('returns at most 20 sessions sorted by timestamp desc', () => {
      const memento = makeMockMemento();
      const manager = new SessionManager(memento as any);

      // Create 25 sessions
      const sessions = [];
      for (let i = 0; i < 25; i++) {
        const s = manager.createSession('code', 'cybermindcli');
        s.timestamp = i * 1000;
        manager.saveCurrentSession();
        sessions.push(s);
      }

      const all = manager.getAllSessions();
      expect(all.length).toBeLessThanOrEqual(20);

      // Should be sorted by timestamp descending
      for (let i = 0; i < all.length - 1; i++) {
        expect(all[i].timestamp).toBeGreaterThanOrEqual(all[i + 1].timestamp);
      }
    });
  });

  describe('loadSession', () => {
    it('loads a saved session by ID', () => {
      const memento = makeMockMemento();
      const manager = new SessionManager(memento as any);

      const session = manager.createSession('security', 'elite-claude');
      manager.addMessage({
        id: 'msg-1',
        role: 'user',
        content: 'Scan my code',
        timestamp: Date.now(),
      });
      manager.saveCurrentSession();

      const loaded = manager.loadSession(session.id);
      expect(loaded).not.toBeNull();
      expect(loaded!.id).toBe(session.id);
      expect(loaded!.agentId).toBe('security');
    });

    it('returns null for unknown session ID', () => {
      const manager = new SessionManager(makeMockMemento() as any);
      expect(manager.loadSession('nonexistent-id')).toBeNull();
    });
  });

  describe('deleteSession', () => {
    it('deletes a stored session and clears it when it is current', () => {
      const memento = makeMockMemento();
      const manager = new SessionManager(memento as any);

      const session = manager.createSession('security', 'cybermindcli');
      manager.addMessage({
        id: 'msg-1',
        role: 'user',
        content: 'Scan the workspace',
        timestamp: Date.now(),
      });
      manager.saveCurrentSession();

      expect(manager.deleteSession(session.id)).toBe(true);
      expect(manager.getCurrentSession()).toBeNull();
      expect(manager.getAllSessions()).toHaveLength(0);
    });
  });

  describe('addMessage', () => {
    it('adds messages to current session', () => {
      const manager = new SessionManager(makeMockMemento() as any);
      manager.createSession('code', 'cybermindcli');

      manager.addMessage({ id: '1', role: 'user', content: 'Hello', timestamp: Date.now() });
      manager.addMessage({ id: '2', role: 'assistant', content: 'Hi!', timestamp: Date.now() });

      expect(manager.getCurrentSession()!.messages).toHaveLength(2);
    });

    it('creates a new session if none exists', () => {
      const manager = new SessionManager(makeMockMemento() as any);

      manager.addMessage({ id: '1', role: 'user', content: 'Hello', timestamp: Date.now() });

      expect(manager.getCurrentSession()).not.toBeNull();
      expect(manager.getCurrentSession()!.messages).toHaveLength(1);
    });
  });
});
