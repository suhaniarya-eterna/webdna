export type SystemStatus = 'healthy' | 'warning' | 'failure' | 'recovery';
export type FileStatus = 'original' | 'degraded' | 'patched' | 'reinforced';

export interface CodeLine {
  id: string;
  text: string;
  type?: 'comment' | 'keyword' | 'function' | 'string' | 'variable' | 'added' | 'removed' | 'modified';
}

export interface RepoFile {
  name: string;
  path: string;
  language: 'python' | 'javascript' | 'dockerfile' | 'yaml' | 'nginx' | 'json';
  status: FileStatus;
  lines: CodeLine[];
  lastCommit?: string;
  updatedAt?: string;
  integrity: number; // 0 to 100
}

export interface SystemEvent {
  id: string;
  type: 'info' | 'error' | 'success' | 'action' | 'stage';
  message: string;
  timestamp: Date;
  mutationType?: MutationType;
  stage?: 'detection' | 'response' | 'learning' | 'idle';
  targetFile?: string;
  affectedFiles?: string[];
  isVaccineEffect?: boolean;
}

export type MutationType = 
  | 'SQL_INJECTION' | 'XSS' | 'CSRF' 
  | 'DDOS' | 'BOT_SWARM' | 'API_ABUSE' 
  | 'ZERO_DAY' | 'RANSOMWARE' | 'DATA_EXFIL';

const INITIAL_FILES: Record<string, RepoFile> = {
  'config.py': {
    name: 'config.py',
    path: '/app/config.py',
    language: 'python',
    status: 'original',
    integrity: 100,
    lines: [
      { id: 'c1', text: 'import os', type: 'keyword' },
      { id: 'c2', text: 'class Config:', type: 'keyword' },
      { id: 'c3', text: '    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")', type: 'variable' },
      { id: 'c4', text: '    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:password@db:5432/appdb")', type: 'variable' },
      { id: 'c5', text: '    SQLALCHEMY_TRACK_MODIFICATIONS = False', type: 'variable' },
      { id: 'c6', text: '    RATE_LIMIT = 100', type: 'variable' },
      { id: 'c7', text: '    RATE_WINDOW = 60', type: 'variable' },
    ]
  },
  'firewall.py': {
    name: 'firewall.py',
    path: '/app/firewall.py',
    language: 'python',
    status: 'original',
    integrity: 100,
    lines: [
      { id: 'f1', text: 'import time', type: 'keyword' },
      { id: 'f2', text: 'from flask import request, abort, current_app', type: 'keyword' },
      { id: 'f3', text: 'request_log = {}', type: 'variable' },
      { id: 'f4', text: 'def rate_limit():', type: 'function' },
      { id: 'f5', text: '    ip = request.remote_addr', type: 'variable' },
      { id: 'f6', text: '    # Basic monitoring logic', type: 'comment' },
      { id: 'f7', text: '    pass', type: 'keyword' },
    ]
  },
  'models.py': {
    name: 'models.py',
    path: '/app/models.py',
    language: 'python',
    status: 'original',
    integrity: 100,
    lines: [
      { id: 'm1', text: 'from .extensions import db, bcrypt', type: 'keyword' },
      { id: 'm2', text: 'class User(db.Model):', type: 'keyword' },
      { id: 'm3', text: '    id = db.Column(db.Integer, primary_key=True)', type: 'variable' },
      { id: 'm4', text: '    email = db.Column(db.String(120), unique=True)', type: 'variable' },
      { id: 'm5', text: '    password_hash = db.Column(db.String(128))', type: 'variable' },
    ]
  }
};

const MUTATION_PATCHES: Record<MutationType, any> = {
  SQL_INJECTION: [{
    file: 'models.py',
    removedIds: [],
    added: [
      { text: '    @staticmethod', type: 'added' },
      { text: '    def safe_find(email): return User.query.filter_by(email=email).first()', type: 'added' }
    ]
  }],
  XSS: [{
    file: 'firewall.py',
    removedIds: [],
    added: [
      { text: 'def secure_headers(res):', type: 'added' },
      { text: '    res.headers["X-XSS-Protection"] = "1; mode=block"', type: 'added' },
      { text: '    return res', type: 'added' }
    ]
  }],
  CSRF: [{
    file: 'config.py',
    removedIds: [],
    added: [{ text: '    WTF_CSRF_ENABLED = True', type: 'added' }]
  }],
  DDOS: [{
    file: 'firewall.py',
    removedIds: ['f6', 'f7'],
    added: [
      { text: '    r = redis.Redis.from_url(current_app.config["REDIS_URL"])', type: 'added' },
      { text: '    if r.incr(f"rate:{ip}") > 100: abort(429)', type: 'added' }
    ]
  }],
  BOT_SWARM: [{
    file: 'firewall.py',
    removedIds: [],
    added: [{ text: '    if "headless" in request.headers.get("User-Agent", "").lower(): abort(403)', type: 'added' }]
  }],
  API_ABUSE: [{
    file: 'config.py',
    removedIds: ['c6'],
    added: [{ text: '    RATE_LIMIT = 20 # Tightened for API Abuse', type: 'added' }]
  }],
  ZERO_DAY: [{
    file: 'firewall.py',
    removedIds: [],
    added: [{ text: '    monitor_anomaly_patterns() # Zero-Day Defense', type: 'added' }]
  }],
  RANSOMWARE: [{
    file: 'firewall.py',
    removedIds: [],
    added: [{ text: '    if request.content_length > 10000: abort(413)', type: 'added' }]
  }],
  DATA_EXFIL: [{
    file: 'firewall.py',
    removedIds: [],
    added: [{ text: '    check_outbound_data_threshold()', type: 'added' }]
  }]
};

class GeneSysEngine {
  private memory: Record<string, string> = {};
  private listeners: ((event: SystemEvent) => void)[] = [];
  private repoListeners: ((files: Record<string, RepoFile>) => void)[] = [];
  private files: Record<string, RepoFile> = JSON.parse(JSON.stringify(INITIAL_FILES));

  subscribe(callback: (event: SystemEvent) => void) {
    this.listeners.push(callback);
    return () => { this.listeners = this.listeners.filter(l => l !== callback); };
  }

  subscribeRepo(callback: (files: Record<string, RepoFile>) => void) {
    this.repoListeners.push(callback);
    callback({ ...this.files });
    return () => { this.repoListeners = this.repoListeners.filter(l => l !== callback); };
  }

  private emit(event: Omit<SystemEvent, 'id' | 'timestamp'>) {
    const fullEvent: SystemEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    this.listeners.forEach(l => l(fullEvent));
  }

  private updateFile(name: string, patch: Partial<RepoFile>) {
    if (!this.files[name]) return;
    this.files[name] = { ...this.files[name], ...patch, updatedAt: 'Just now' };
    this.repoListeners.forEach(l => l({ ...this.files }));
  }

  getMemory() {
    return { ...this.memory };
  }

  async simulateMutation(type: MutationType) {
    const isVaccinated = !!this.memory[type];
    const delayMultiplier = isVaccinated ? 0.2 : 1;
    const patches = MUTATION_PATCHES[type] || [];
    const affectedFiles = patches.map((p: any) => p.file);

    this.emit({ 
      type: isVaccinated ? 'action' : 'stage', 
      message: isVaccinated 
        ? `VACCINE_APPLIED: Genetic memory recognizes ${type}. Deploying antibodies immediately.` 
        : `THREAT_DETECTED: [${type}] Analyzing potential structural damage...`, 
      mutationType: type,
      stage: 'detection',
      affectedFiles,
      isVaccineEffect: isVaccinated
    });

    if (!isVaccinated) {
      affectedFiles.forEach((file: string) => this.updateFile(file, { status: 'degraded', integrity: 40 }));
      await new Promise(r => setTimeout(r, 1200 * delayMultiplier));
    } else {
      // Vaccination means we just reinforce immediately
      affectedFiles.forEach((file: string) => this.updateFile(file, { status: 'reinforced', integrity: 95 }));
      await new Promise(r => setTimeout(r, 400));
    }

    if (!isVaccinated) {
      this.emit({ 
        type: 'stage', 
        message: `GENESIS_REPAIR: Injecting logic antibodies...`, 
        mutationType: type,
        stage: 'response',
        affectedFiles
      });

      patches.forEach((patch: any) => {
        const current = this.files[patch.file];
        if (!current) return;
        
        const newLines = current.lines.map(l => patch.removedIds.includes(l.id) ? { ...l, type: 'removed' as const } : l);
        
        // Dynamic ID generation to avoid React duplicate key errors
        const addedLines = patch.added.map((line: any, i: number) => ({
          ...line,
          id: `added-${type}-${patch.file}-${Date.now()}-${i}`
        }));

        newLines.push(...addedLines);
        
        this.updateFile(patch.file, { 
          lines: newLines, 
          status: 'patched', 
          integrity: 70 
        });
      });

      await new Promise(r => setTimeout(r, 1800 * delayMultiplier));
    }

    this.emit({ 
      type: 'success', 
      message: isVaccinated 
        ? `REINFORCED: Immune response complete. Target integrity restored via Antibody ${this.memory[type]}.` 
        : `HEALED: System stabilized. New antibody stored in genetic memory.`, 
      stage: 'learning',
      affectedFiles
    });
    
    patches.forEach((patch: any) => {
      const f = this.files[patch.file];
      this.updateFile(patch.file, { 
        status: 'reinforced', 
        integrity: 100,
        lines: f.lines.filter(l => l.type !== 'removed').map(l => {
          if (l.type === 'added') return { ...l, type: 'modified' as const };
          return l;
        })
      });
    });

    if (!isVaccinated) {
      this.memory[type] = `ABS-${type.slice(0, 3)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    }
    
    await new Promise(r => setTimeout(r, 800 * delayMultiplier));
    this.emit({ type: 'success', message: `CORE_STABLE: Monitoring for next mutation cycle.`, stage: 'idle' });
  }
}

export const engine = new GeneSysEngine();