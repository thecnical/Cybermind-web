import * as vscode from 'vscode';

const KEY_AUTH_TOKEN = 'cybermind.authToken';
const KEY_API_KEY = 'cybermind.apiKey';
const API_KEY_REGEX = /^cp_live_[a-zA-Z0-9]+$/;

export class AuthManager {
  constructor(private readonly secrets: vscode.SecretStorage) {}

  async getToken(): Promise<string | null> {
    const token = await this.secrets.get(KEY_AUTH_TOKEN);
    return token ?? null;
  }

  async setToken(token: string): Promise<void> {
    await this.secrets.store(KEY_AUTH_TOKEN, token);
  }

  async getApiKey(): Promise<string | null> {
    const key = await this.secrets.get(KEY_API_KEY);
    return key ?? null;
  }

  async setApiKey(apiKey: string): Promise<void> {
    await this.secrets.store(KEY_API_KEY, apiKey);
  }

  async clearAll(): Promise<void> {
    await this.secrets.delete(KEY_AUTH_TOKEN);
    await this.secrets.delete(KEY_API_KEY);
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    const apiKey = await this.getApiKey();
    return !!(token || apiKey);
  }

  validateApiKeyFormat(key: string): boolean {
    return API_KEY_REGEX.test(key);
  }
}
