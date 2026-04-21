import * as vscode from 'vscode';
import * as crypto from 'crypto';

export interface FileOpRecord {
  type: 'create' | 'edit' | 'delete' | 'mkdir';
  path: string;
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  agentId?: string;
  fileOps?: FileOpRecord[];
}

export interface Session {
  id: string;
  title: string;
  timestamp: number;
  agentId: string;
  modelId: string;
  messages: Message[];
}

export interface SessionSummary {
  id: string;
  title: string;
  timestamp: number;
  agentId: string;
  modelId: string;
  messageCount: number;
}

const SESSIONS_KEY = 'cybermind.sessions';
const MAX_SESSIONS = 20;
const MAX_MESSAGES = 100;
const SUMMARIZE_OLDEST = 50;

export class SessionManager {
  private currentSession: Session | null = null;

  constructor(private readonly globalState: vscode.Memento) {}

  createSession(agentId: string, modelId: string): Session {
    const session: Session = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      timestamp: Date.now(),
      agentId,
      modelId,
      messages: [],
    };
    this.currentSession = session;
    return session;
  }

  getCurrentSession(): Session | null {
    return this.currentSession;
  }

  loadSession(id: string): Session | null {
    const all = this.getStoredSessions();
    const session = all.find(s => s.id === id) ?? null;
    if (session) {
      this.currentSession = session;
    }
    return session;
  }

  saveCurrentSession(): void {
    if (!this.currentSession) return;

    const all = this.getStoredSessions();
    const idx = all.findIndex(s => s.id === this.currentSession!.id);

    if (idx >= 0) {
      all[idx] = this.currentSession;
    } else {
      all.unshift(this.currentSession);
    }

    // Sort by timestamp descending and keep max 20
    const sorted = all
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_SESSIONS);

    this.globalState.update(SESSIONS_KEY, sorted);
  }

  getAllSessions(): Session[] {
    return this.getStoredSessions()
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, MAX_SESSIONS);
  }

  deleteSession(id: string): boolean {
    const all = this.getStoredSessions();
    const next = all.filter(session => session.id !== id);
    const deleted = next.length !== all.length;

    if (!deleted) {
      return false;
    }

    if (this.currentSession?.id === id) {
      this.currentSession = null;
    }

    this.globalState.update(SESSIONS_KEY, next);
    return true;
  }

  addMessage(message: Message): void {
    if (!this.currentSession) {
      this.createSession('code', 'cybermindcli');
    }

    this.currentSession!.messages.push(message);

    // Auto-generate title from first user message
    if (
      message.role === 'user' &&
      this.currentSession!.title === 'New Chat' &&
      this.currentSession!.messages.filter(m => m.role === 'user').length === 1
    ) {
      this.currentSession!.title = message.content.slice(0, 60).trim();
    }

    // Update session timestamp
    this.currentSession!.timestamp = Date.now();
  }

  async summarizeIfNeeded(): Promise<void> {
    if (!this.currentSession) return;

    const messages = this.currentSession.messages;
    if (messages.length <= MAX_MESSAGES) return;

    // Take the oldest SUMMARIZE_OLDEST messages and replace with a summary
    const toSummarize = messages.slice(0, SUMMARIZE_OLDEST);
    const remaining = messages.slice(SUMMARIZE_OLDEST);

    // Build a simple summary from the messages
    const summaryContent = this.buildSummary(toSummarize);

    const summaryMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: summaryContent,
      timestamp: toSummarize[toSummarize.length - 1]?.timestamp ?? Date.now(),
      agentId: 'system',
    };

    this.currentSession.messages = [summaryMessage, ...remaining];
  }

  private buildSummary(messages: Message[]): string {
    const userMessages = messages.filter(m => m.role === 'user');
    const topics = userMessages
      .slice(0, 5)
      .map(m => m.content.slice(0, 100))
      .join('; ');

    return `[Context Summary] This conversation covered: ${topics}. (${messages.length} messages summarized)`;
  }

  private getStoredSessions(): Session[] {
    return this.globalState.get<Session[]>(SESSIONS_KEY, []);
  }
}
