import * as vscode from 'vscode';

const KEY_AUTH_TOKEN = 'cybermind.authToken';
const KEY_API_KEY = 'cybermind.apiKey';
const KEY_USER_EMAIL = 'cybermind.userEmail';
const KEY_USER_PLAN = 'cybermind.userPlan';
// cp_live_ followed by base64url chars (A-Z, a-z, 0-9, -, _)
const API_KEY_REGEX = /^cp_live_[A-Za-z0-9\-_]{20,}$/;

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

  async getUserEmail(): Promise<string | null> {
    const email = await this.secrets.get(KEY_USER_EMAIL);
    return email ?? null;
  }

  async setUserEmail(email: string): Promise<void> {
    await this.secrets.store(KEY_USER_EMAIL, email);
  }

  async getUserPlan(): Promise<string> {
    const plan = await this.secrets.get(KEY_USER_PLAN);
    return plan ?? 'free';
  }

  async setUserPlan(plan: string): Promise<void> {
    await this.secrets.store(KEY_USER_PLAN, plan);
  }

  async clearAll(): Promise<void> {
    await this.secrets.delete(KEY_AUTH_TOKEN);
    await this.secrets.delete(KEY_API_KEY);
    await this.secrets.delete(KEY_USER_EMAIL);
    await this.secrets.delete(KEY_USER_PLAN);
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
