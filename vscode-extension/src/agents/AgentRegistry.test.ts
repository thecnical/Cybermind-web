import { AgentRegistry } from './AgentRegistry';

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

describe('AgentRegistry', () => {
  describe('getBuiltInAgents', () => {
    it('returns all 7 built-in agents with correct IDs', () => {
      const registry = new AgentRegistry(makeMockMemento() as any);
      const agents = registry.getBuiltInAgents();

      expect(agents).toHaveLength(7);

      const ids = agents.map(a => a.id);
      expect(ids).toContain('security');
      expect(ids).toContain('code');
      expect(ids).toContain('unit-test');
      expect(ids).toContain('bug-fix');
      expect(ids).toContain('explain');
      expect(ids).toContain('refactor');
      expect(ids).toContain('docs');
    });

    it('all built-in agents have non-empty system prompts', () => {
      const registry = new AgentRegistry(makeMockMemento() as any);
      const agents = registry.getBuiltInAgents();

      for (const agent of agents) {
        expect(agent.systemPrompt.length).toBeGreaterThan(50);
        expect(agent.isCustom).toBe(false);
      }
    });

    it('security agent prompt contains cybermind-findings XML tag', () => {
      const registry = new AgentRegistry(makeMockMemento() as any);
      const security = registry.getAgent('security');
      expect(security?.systemPrompt).toContain('<cybermind-findings>');
    });
  });

  describe('custom agent save/delete round-trip', () => {
    it('saves and retrieves a custom agent', () => {
      const memento = makeMockMemento();
      const registry = new AgentRegistry(memento as any);

      registry.saveCustomAgent({
        id: 'my-custom',
        name: 'My Custom Agent',
        icon: '🤖',
        description: 'A custom agent',
        systemPrompt: 'You are a custom agent.',
      });

      const custom = registry.getCustomAgents();
      expect(custom).toHaveLength(1);
      expect(custom[0].id).toBe('my-custom');
      expect(custom[0].name).toBe('My Custom Agent');
      expect(custom[0].isCustom).toBe(true);
    });

    it('deletes a custom agent', () => {
      const memento = makeMockMemento();
      const registry = new AgentRegistry(memento as any);

      registry.saveCustomAgent({
        id: 'to-delete',
        name: 'Delete Me',
        icon: '🗑️',
        description: 'Will be deleted',
        systemPrompt: 'Delete me.',
      });

      expect(registry.getCustomAgents()).toHaveLength(1);

      registry.deleteCustomAgent('to-delete');

      expect(registry.getCustomAgents()).toHaveLength(0);
    });

    it('updates existing custom agent on save with same ID', () => {
      const memento = makeMockMemento();
      const registry = new AgentRegistry(memento as any);

      registry.saveCustomAgent({
        id: 'my-agent',
        name: 'Original Name',
        icon: '🤖',
        description: 'Original',
        systemPrompt: 'Original prompt.',
      });

      registry.saveCustomAgent({
        id: 'my-agent',
        name: 'Updated Name',
        icon: '🤖',
        description: 'Updated',
        systemPrompt: 'Updated prompt.',
      });

      const custom = registry.getCustomAgents();
      expect(custom).toHaveLength(1);
      expect(custom[0].name).toBe('Updated Name');
    });

    it('getAllAgents returns built-in + custom agents', () => {
      const memento = makeMockMemento();
      const registry = new AgentRegistry(memento as any);

      registry.saveCustomAgent({
        id: 'custom-1',
        name: 'Custom 1',
        icon: '🤖',
        description: 'Custom',
        systemPrompt: 'Custom.',
      });

      const all = registry.getAllAgents();
      expect(all.length).toBe(8); // 7 built-in + 1 custom
    });

    it('getAgent returns undefined for unknown ID', () => {
      const registry = new AgentRegistry(makeMockMemento() as any);
      expect(registry.getAgent('nonexistent')).toBeUndefined();
    });
  });
});
