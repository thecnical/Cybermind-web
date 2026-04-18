import { AuthManager } from './AuthManager';

// Mock SecretStorage
function makeSecretStorage() {
  const store: Record<string, string> = {};
  return {
    get: jest.fn(async (key: string) => store[key] ?? undefined),
    store: jest.fn(async (key: string, value: string) => { store[key] = value; }),
    delete: jest.fn(async (key: string) => { delete store[key]; }),
    onDidChange: jest.fn(),
    _store: store,
  };
}

describe('AuthManager', () => {
  describe('validateApiKeyFormat', () => {
    let auth: AuthManager;

    beforeEach(() => {
      auth = new AuthManager(makeSecretStorage() as any);
    });

    it('accepts valid cp_live_ keys', () => {
      expect(auth.validateApiKeyFormat('cp_live_abc123')).toBe(true);
      expect(auth.validateApiKeyFormat('cp_live_ABC123xyz')).toBe(true);
      expect(auth.validateApiKeyFormat('cp_live_a')).toBe(true);
      expect(auth.validateApiKeyFormat('cp_live_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).toBe(true);
    });

    it('rejects malformed keys', () => {
      expect(auth.validateApiKeyFormat('')).toBe(false);
      expect(auth.validateApiKeyFormat('cp_live_')).toBe(false); // empty suffix
      expect(auth.validateApiKeyFormat('cp_test_abc123')).toBe(false);
      expect(auth.validateApiKeyFormat('sk-abc123')).toBe(false);
      expect(auth.validateApiKeyFormat('cp_live_abc 123')).toBe(false); // space
      expect(auth.validateApiKeyFormat('cp_live_abc-123')).toBe(false); // hyphen
      expect(auth.validateApiKeyFormat('CP_LIVE_abc123')).toBe(false); // uppercase prefix
      expect(auth.validateApiKeyFormat('cp_live_abc123!')).toBe(false); // special char
    });
  });

  describe('clearAll', () => {
    it('removes both token and API key', async () => {
      const secrets = makeSecretStorage();
      const auth = new AuthManager(secrets as any);

      await auth.setToken('test-jwt-token');
      await auth.setApiKey('cp_live_testkey123');

      expect(await auth.getToken()).toBe('test-jwt-token');
      expect(await auth.getApiKey()).toBe('cp_live_testkey123');

      await auth.clearAll();

      expect(await auth.getToken()).toBeNull();
      expect(await auth.getApiKey()).toBeNull();
      expect(secrets.delete).toHaveBeenCalledWith('cybermind.authToken');
      expect(secrets.delete).toHaveBeenCalledWith('cybermind.apiKey');
    });
  });

  describe('isAuthenticated', () => {
    it('returns false when no credentials stored', async () => {
      const auth = new AuthManager(makeSecretStorage() as any);
      expect(await auth.isAuthenticated()).toBe(false);
    });

    it('returns true when token is stored', async () => {
      const auth = new AuthManager(makeSecretStorage() as any);
      await auth.setToken('some-jwt');
      expect(await auth.isAuthenticated()).toBe(true);
    });

    it('returns true when API key is stored', async () => {
      const auth = new AuthManager(makeSecretStorage() as any);
      await auth.setApiKey('cp_live_abc123');
      expect(await auth.isAuthenticated()).toBe(true);
    });
  });

  describe('token storage', () => {
    it('stores and retrieves token', async () => {
      const auth = new AuthManager(makeSecretStorage() as any);
      await auth.setToken('my-jwt-token');
      expect(await auth.getToken()).toBe('my-jwt-token');
    });

    it('returns null when no token stored', async () => {
      const auth = new AuthManager(makeSecretStorage() as any);
      expect(await auth.getToken()).toBeNull();
    });
  });

  describe('API key storage', () => {
    it('stores and retrieves API key', async () => {
      const auth = new AuthManager(makeSecretStorage() as any);
      await auth.setApiKey('cp_live_mykey123');
      expect(await auth.getApiKey()).toBe('cp_live_mykey123');
    });

    it('returns null when no API key stored', async () => {
      const auth = new AuthManager(makeSecretStorage() as any);
      expect(await auth.getApiKey()).toBeNull();
    });
  });
});
