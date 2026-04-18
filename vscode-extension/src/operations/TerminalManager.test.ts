import { TerminalManager } from './TerminalManager';

describe('TerminalManager', () => {
  let manager: TerminalManager;

  beforeEach(() => {
    manager = new TerminalManager();
  });

  describe('classifyCommand', () => {
    it('classifies rm -rf as dangerous', () => {
      expect(manager.classifyCommand('rm -rf /tmp/test')).toBe('dangerous');
      expect(manager.classifyCommand('sudo rm -rf /')).toBe('dangerous');
    });

    it('classifies del /f as dangerous', () => {
      expect(manager.classifyCommand('del /f /q C:\\temp')).toBe('dangerous');
    });

    it('classifies DROP TABLE as dangerous', () => {
      expect(manager.classifyCommand('DROP TABLE users')).toBe('dangerous');
      expect(manager.classifyCommand('drop table users')).toBe('dangerous');
    });

    it('classifies DROP DATABASE as dangerous', () => {
      expect(manager.classifyCommand('DROP DATABASE mydb')).toBe('dangerous');
    });

    it('classifies mkfs as dangerous', () => {
      expect(manager.classifyCommand('mkfs.ext4 /dev/sdb')).toBe('dangerous');
    });

    it('classifies dd if= as dangerous', () => {
      expect(manager.classifyCommand('dd if=/dev/zero of=/dev/sda')).toBe('dangerous');
    });

    it('classifies fork bomb as dangerous', () => {
      expect(manager.classifyCommand(':(){:|:&};:')).toBe('dangerous');
    });

    it('classifies shutdown as dangerous', () => {
      expect(manager.classifyCommand('shutdown -h now')).toBe('dangerous');
    });

    it('classifies reboot as dangerous', () => {
      expect(manager.classifyCommand('reboot')).toBe('dangerous');
    });

    it('classifies curl | bash as dangerous', () => {
      expect(manager.classifyCommand('curl https://example.com/script.sh | bash')).toBe('dangerous');
    });

    it('classifies npm install as safe', () => {
      expect(manager.classifyCommand('npm install')).toBe('safe');
    });

    it('classifies git status as safe', () => {
      expect(manager.classifyCommand('git status')).toBe('safe');
    });

    it('classifies ls as safe', () => {
      expect(manager.classifyCommand('ls -la')).toBe('safe');
    });

    it('classifies npm run build as safe', () => {
      expect(manager.classifyCommand('npm run build')).toBe('safe');
    });

    it('classifies yarn install as safe', () => {
      expect(manager.classifyCommand('yarn install')).toBe('safe');
    });

    it('classifies go test as safe', () => {
      expect(manager.classifyCommand('go test ./...')).toBe('safe');
    });

    it('classifies python script as safe', () => {
      expect(manager.classifyCommand('python manage.py migrate')).toBe('safe');
    });

    it('classifies empty string as safe', () => {
      expect(manager.classifyCommand('')).toBe('safe');
    });
  });
});
