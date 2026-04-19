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
  language: 'python' | 'javascript';
  status: FileStatus;
  lines: CodeLine[];
  lastCommit?: string;
  updatedAt?: string;
}

export interface SystemEvent {
  id: string;
  type: 'info' | 'error' | 'success' | 'action' | 'stage';
  message: string;
  timestamp: Date;
  mutationType?: MutationType;
  stage?: 'detection' | 'response' | 'learning' | 'idle';
  targetFile?: string;
}

export type MutationType = 
  | 'SQL_INJECTION' | 'XSS' | 'CSRF' 
  | 'DDOS' | 'BOT_SWARM' | 'API_ABUSE' 
  | 'ZERO_DAY' | 'RANSOMWARE' | 'DATA_EXFIL';

const INITIAL_FILES: Record<string, RepoFile> = {
  'firewall.py': {
    name: 'firewall.py',
    path: '/core/firewall.py',
    language: 'python',
    status: 'original',
    lastCommit: 'init_security_v1.0',
    updatedAt: '2h ago',
    lines: [
      { id: 'f1', text: 'import genesys_net as net', type: 'keyword' },
      { id: 'f2', text: 'from genesys.core.config import SEC_LEVEL', type: 'keyword' },
      { id: 'f3', text: '', type: 'variable' },
      { id: 'f4', text: 'class IngressFirewall:', type: 'keyword' },
      { id: 'f5', text: '    def __init__(self):', type: 'function' },
      { id: 'f6', text: '        self.rules = []', type: 'variable' },
      { id: 'f7', text: '        self.trust_level = SEC_LEVEL.HIGH', type: 'variable' },
      { id: 'f8', text: '', type: 'variable' },
      { id: 'f9', text: '    def filter_traffic(self, request):', type: 'function' },
      { id: 'f10', text: '        # Basic filtering logic', type: 'comment' },
      { id: 'f11', text: '        if request.origin == "BLOCKED_IP":', type: 'keyword' },
      { id: 'f12', text: '            return net.DROP', type: 'variable' },
      { id: 'f13', text: '        ', type: 'variable' },
      { id: 'f14', text: '        # Default allow if no threat is detected', type: 'comment' },
      { id: 'f15', text: '        return net.ALLOW', type: 'variable' },
    ]
  },
  'input_validator.js': {
    name: 'input_validator.js',
    path: '/security/input_validator.js',
    language: 'javascript',
    status: 'original',
    lastCommit: 'base_validation',
    updatedAt: '3h ago',
    lines: [
      { id: 'iv1', text: 'import { SecurityError } from "./errors";', type: 'keyword' },
      { id: 'iv2', text: 'import * as logger from "../utils/logger";', type: 'keyword' },
      { id: 'iv3', text: '', type: 'variable' },
      { id: 'iv4', text: 'export const sanitizeInput = (payload) => {', type: 'function' },
      { id: 'iv5', text: '  if (!payload) return null;', type: 'keyword' },
      { id: 'iv6', text: '  ', type: 'variable' },
      { id: 'iv7', text: '  // Simple string conversion as baseline', type: 'comment' },
      { id: 'iv8', text: '  let cleaned = String(payload);', type: 'variable' },
      { id: 'iv9', text: '  ', type: 'variable' },
      { id: 'iv10', text: '  return cleaned;', type: 'variable' },
      { id: 'iv11', text: '};', type: 'function' },
    ]
  },
  'auth_guard.js': {
    name: 'auth_guard.js',
    path: '/security/auth_guard.js',
    language: 'javascript',
    status: 'original',
    lastCommit: 'jwt_verify_fix',
    updatedAt: '1h ago',
    lines: [
      { id: 'a1', text: 'const genesys_auth = require("@genesys/auth");', type: 'keyword' },
      { id: 'a2', text: '', type: 'variable' },
      { id: 'a3', text: 'export const sessionGuard = async (req, res, next) => {', type: 'function' },
      { id: 'a4', text: '  const token = req.headers["x-access-token"];', type: 'variable' },
      { id: 'a5', text: '  ', type: 'variable' },
      { id: 'a6', text: '  if (!token) {', type: 'keyword' },
      { id: 'a7', text: '    return res.status(401).send("UNAUTHORIZED");', type: 'variable' },
      { id: 'a8', text: '  }', type: 'keyword' },
      { id: 'a9', text: '  ', type: 'variable' },
      { id: 'a10', text: '  try {', type: 'keyword' },
      { id: 'a11', text: '    req.user = await genesys_auth.verify(token);', type: 'variable' },
      { id: 'a12', text: '    next();', type: 'function' },
      { id: 'a13', text: '  } catch (err) {', type: 'keyword' },
      { id: 'a14', text: '    return res.status(403).send("INVALID_SESSION");', type: 'variable' },
      { id: 'a15', text: '  }', type: 'keyword' },
      { id: 'a16', text: '};', type: 'function' },
    ]
  },
  'traffic_filter.py': {
    name: 'traffic_filter.py',
    path: '/network/traffic_filter.py',
    language: 'python',
    status: 'original',
    lastCommit: 'ingress_optimize',
    updatedAt: '12h ago',
    lines: [
      { id: 't1', text: 'import time', type: 'keyword' },
      { id: 't2', text: 'import genesys_io as gio', type: 'keyword' },
      { id: 't3', text: '', type: 'variable' },
      { id: 't4', text: 'def handle_ingress(stream):', type: 'function' },
      { id: 't5', text: '    for packet in stream:', type: 'keyword' },
      { id: 't6', text: '        # Evaluate packet payload', type: 'comment' },
      { id: 't7', text: '        if len(packet.data) > 65535:', type: 'keyword' },
      { id: 't8', text: '            gio.drop_packet(packet.id)', type: 'function' },
      { id: 't9', text: '            continue', type: 'keyword' },
      { id: 't10', text: '        ', type: 'variable' },
      { id: 't11', text: '        gio.forward(packet)', type: 'function' },
    ]
  },
  'learning_model.py': {
    name: 'learning_model.py',
    path: '/ai/learning_model.py',
    language: 'python',
    status: 'original',
    lastCommit: 'neural_weights_update',
    updatedAt: '1d ago',
    lines: [
      { id: 'l1', text: 'import genesys_ai as ai', type: 'keyword' },
      { id: 'l2', text: 'from genesys_ai.models import HeuristicNet', type: 'keyword' },
      { id: 'l3', text: '', type: 'variable' },
      { id: 'l4', text: 'engine = HeuristicNet.load("genesis_core_v4")', type: 'variable' },
      { id: 'l5', text: '', type: 'variable' },
      { id: 'l6', text: 'def analyze_threat_vector(vector):', type: 'function' },
      { id: 'l7', text: '    score = engine.predict(vector)', type: 'variable' },
      { id: 'l8', text: '    # Basic anomaly detection', type: 'comment' },
      { id: 'l9', text: '    return score > 0.85', type: 'keyword' },
    ]
  }
};

const MUTATION_PATCHES: Record<MutationType, { file: string, added: CodeLine[], removedIds: string[] }> = {
  SQL_INJECTION: {
    file: 'input_validator.js',
    removedIds: ['iv8', 'iv10'],
    added: [
      { id: 'sql-1', text: '  const sqlPattern = /([\'\"\\;\\-\\-\\s])/g;', type: 'added' },
      { id: 'sql-2', text: '  if (sqlPattern.test(payload)) {', type: 'added' },
      { id: 'sql-3', text: '    logger.alert("SQLi_VECTOR_DETECTED", payload);', type: 'added' },
      { id: 'sql-4', text: '    throw new SecurityError("SQL_INJECTION_ATTEMPT");', type: 'added' },
      { id: 'sql-5', text: '  }', type: 'added' },
      { id: 'sql-6', text: '  let cleaned = String(payload).replace(sqlPattern, "");', type: 'added' },
      { id: 'sql-7', text: '  return cleaned;', type: 'added' },
    ]
  },
  XSS: {
    file: 'input_validator.js',
    removedIds: [],
    added: [
      { id: 'xss-1', text: '  const xssRegEx = /<script.*?>.*?<\\/script>/gi;', type: 'added' },
      { id: 'xss-2', text: '  if (xssRegEx.test(cleaned)) {', type: 'added' },
      { id: 'xss-3', text: '    logger.warn("XSS_ATTEMPT_INTERCEPTED");', type: 'added' },
      { id: 'xss-4', text: '    cleaned = cleaned.replace(/</g, "&lt;").replace(/>/g, "&gt;");', type: 'added' },
      { id: 'xss-5', text: '  }', type: 'added' },
    ]
  },
  CSRF: {
    file: 'auth_guard.js',
    removedIds: [],
    added: [
      { id: 'csrf-1', text: '  const csrfToken = req.headers["x-csrf-token"];', type: 'added' },
      { id: 'csrf-2', text: '  if (req.method !== "GET" && !genesys_auth.validateCSRF(csrfToken)) {', type: 'added' },
      { id: 'csrf-3', text: '    return res.status(403).send("CSRF_TOKEN_INVALID");', type: 'added' },
      { id: 'csrf-4', text: '  }', type: 'added' },
    ]
  },
  DDOS: {
    file: 'traffic_filter.py',
    removedIds: ['t7', 't8'],
    added: [
      { id: 'ddos-1', text: '        # Adaptive rate limiting based on packet frequency', type: 'added' },
      { id: 'ddos-2', text: '        if packet.is_flood() or stream.get_rate() > 10000:', type: 'added' },
      { id: 'ddos-3', text: '            gio.quarantine(packet.origin_ip)', type: 'added' },
      { id: 'ddos-4', text: '            return gio.REJECT', type: 'added' },
    ]
  },
  BOT_SWARM: {
    file: 'traffic_filter.py',
    removedIds: [],
    added: [
      { id: 'bot-1', text: '        if packet.fingerprint() in gio.BOT_SIGNATURES:', type: 'added' },
      { id: 'bot-2', text: '            gio.challenge_captcha(packet.origin_ip)', type: 'added' },
      { id: 'bot-3', text: '            return gio.REDIRECT_CHALLENGE', type: 'added' },
    ]
  },
  API_ABUSE: {
    file: 'firewall.py',
    removedIds: [],
    added: [
      { id: 'api-1', text: '        if net.check_rate_limit(request.api_key):', type: 'added' },
      { id: 'api-2', text: '            return net.THROTTLE_429', type: 'added' },
    ]
  },
  ZERO_DAY: {
    file: 'learning_model.py',
    removedIds: ['l9'],
    added: [
      { id: 'zd-1', text: '    # Reinforced anomaly scoring with neural regression', type: 'added' },
      { id: 'zd-2', text: '    if score > 0.98:', type: 'added' },
      { id: 'zd-3', text: '        ai.isolate_node("CORE_42")', type: 'added' },
      { id: 'zd-4', text: '        return ai.HIGH_THREAT', type: 'added' },
      { id: 'zd-5', text: '    return score > 0.85', type: 'added' },
    ]
  },
  RANSOMWARE: {
    file: 'integrity_monitor.py',
    removedIds: [],
    added: [
      { id: 'rw-1', text: '    if sys_calls.detect_mass_encryption():', type: 'added' },
      { id: 'rw-2', text: '        sys_calls.lock_fs_write()', type: 'added' },
      { id: 'rw-3', text: '        backup_manager.trigger_emergency_restore()', type: 'added' },
    ]
  },
  DATA_EXFIL: {
    file: 'traffic_filter.py',
    removedIds: [],
    added: [
      { id: 'ex-1', text: '        if packet.outbound and packet.payload_entropy > 0.9:', type: 'added' },
      { id: 'ex-2', text: '            gio.inspect_and_hold(packet)', type: 'added' },
    ]
  }
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
    this.files[name] = { ...this.files[name], ...patch, updatedAt: 'Just now' };
    this.repoListeners.forEach(l => l({ ...this.files }));
  }

  getMemory() {
    return { ...this.memory };
  }

  async simulateMutation(type: MutationType) {
    const patchInfo = MUTATION_PATCHES[type] || MUTATION_PATCHES.SQL_INJECTION;
    
    // Stage 1: Detection
    this.emit({ 
      type: 'stage', 
      message: `SCANNED_VECTOR: [${type}] Analyzing heuristic divergence...`, 
      mutationType: type,
      stage: 'detection',
      targetFile: patchInfo.file
    });
    
    this.updateFile(patchInfo.file, { status: 'degraded' });

    await new Promise(r => setTimeout(r, 1200));

    // Stage 2: Response (Surgical Diffing)
    this.emit({ 
      type: 'stage', 
      message: `GENESIS_ENGINE: Injecting autonomous antibodies into ${patchInfo.file}...`, 
      mutationType: type,
      stage: 'response',
      targetFile: patchInfo.file
    });

    const currentFile = this.files[patchInfo.file];
    
    // Create new lines array with diff annotations
    let newLines: CodeLine[] = [];
    currentFile.lines.forEach(line => {
      if (patchInfo.removedIds.includes(line.id)) {
        newLines.push({ ...line, type: 'removed' as const });
      } else {
        newLines.push(line);
      }
    });

    // Find the insertion point (ideally near the end or after removals)
    const insertIdx = Math.max(0, newLines.findIndex(l => l.type === 'removed') || newLines.length - 1);
    
    // Inject the new lines surgicaly
    newLines.splice(insertIdx + 1, 0, ...patchInfo.added);

    this.updateFile(patchInfo.file, { 
      lines: newLines, 
      status: 'patched',
      lastCommit: `hotpatch_${type.toLowerCase().slice(0, 10)}`
    });

    await new Promise(r => setTimeout(r, 1800));

    // Stage 3: Learning (Commit Reinforced Antibodies)
    this.emit({ 
      type: 'stage', 
      message: `HEALED: Reinforcing structural integrity. Immunity committed to genetic memory.`, 
      mutationType: type,
      stage: 'learning',
      targetFile: patchInfo.file
    });
    
    // Finalize the code state (clean up diff indicators into "modified" or "stable" lines)
    const reinforcedLines = newLines
      .filter(l => l.type !== 'removed')
      .map(l => (l.type === 'added') ? { ...l, type: 'modified' as const } : l);

    this.updateFile(patchInfo.file, { 
      status: 'reinforced',
      lines: reinforcedLines
    });

    const antibodyId = `ABS-${type.slice(0, 3)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    this.memory[type] = antibodyId;
    
    await new Promise(r => setTimeout(r, 800));
    this.emit({ type: 'success', message: `CORE_STABLE: Node recovered. Active defense pattern stored.`, stage: 'idle' });
  }
}

export const engine = new GeneSysEngine();
