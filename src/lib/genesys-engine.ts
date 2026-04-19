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
      { id: 'f2', text: 'def filter_traffic(request):', type: 'function' },
      { id: 'f3', text: '    # Basic filtering logic', type: 'comment' },
      { id: 'f4', text: '    if request.origin == "BLOCKED":', type: 'keyword' },
      { id: 'f5', text: '        return net.DROP', type: 'variable' },
      { id: 'f6', text: '    return net.ALLOW', type: 'variable' },
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
      { id: 'iv1', text: 'export const sanitize = (data) => {', type: 'function' },
      { id: 'iv2', text: '  return String(data);', type: 'variable' },
      { id: 'iv3', text: '};', type: 'function' },
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
      { id: 'a1', text: 'const auth = require("@genesys/auth");', type: 'keyword' },
      { id: 'a2', text: 'export const validateSession = (req) => {', type: 'function' },
      { id: 'a3', text: '  if (!req.token) return false;', type: 'keyword' },
      { id: 'a4', text: '  return auth.verify(req.token);', type: 'variable' },
      { id: 'a5', text: '};', type: 'function' },
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
      { id: 't1', text: 'import socket', type: 'keyword' },
      { id: 't2', text: 'def process_packets(buffer):', type: 'function' },
      { id: 't3', text: '    for packet in buffer:', type: 'keyword' },
      { id: 't4', text: '        if packet.size > 1500:', type: 'variable' },
      { id: 't5', text: '            drop(packet)', type: 'function' },
    ]
  },
  'integrity_monitor.py': {
    name: 'integrity_monitor.py',
    path: '/core/integrity_monitor.py',
    language: 'python',
    status: 'original',
    lastCommit: 'fs_watch_init',
    updatedAt: '4h ago',
    lines: [
      { id: 'im1', text: 'def check_file_hashes():', type: 'function' },
      { id: 'im2', text: '    # Basic FS monitoring', type: 'comment' },
      { id: 'im3', text: '    return True', type: 'keyword' },
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
      { id: 'l1', text: 'import tensorflow as tf', type: 'keyword' },
      { id: 'l2', text: 'model = tf.keras.models.load("core_v4")', type: 'variable' },
      { id: 'l3', text: 'def train_on_threat(signature):', type: 'function' },
      { id: 'l4', text: '    # Incremental learning step', type: 'comment' },
      { id: 'l5', text: '    model.fit(signature, epochs=1)', type: 'variable' },
    ]
  }
};

const MUTATION_PATCHES: Record<MutationType, { file: string, added: CodeLine[], removedIds: string[] }> = {
  SQL_INJECTION: {
    file: 'input_validator.js',
    removedIds: ['iv2'],
    added: [
      { id: 'sql-1', text: '  const pattern = /[\'\"\\;\\-\\-\\s]/g;', type: 'added' },
      { id: 'sql-2', text: '  if (pattern.test(data)) throw new Error("SQLi_Detected");', type: 'added' },
      { id: 'sql-3', text: '  return data.replace(pattern, "");', type: 'added' },
    ]
  },
  XSS: {
    file: 'input_validator.js',
    removedIds: [],
    added: [
      { id: 'xss-1', text: '  const xssPattern = /<script.*?>.*?<\\/script>/gi;', type: 'added' },
      { id: 'xss-2', text: '  if (xssPattern.test(data)) {', type: 'added' },
      { id: 'xss-3', text: '    net.log_security_alert("XSS_Attempt", data);', type: 'added' },
      { id: 'xss-4', text: '    return encodeHTML(data);', type: 'added' },
      { id: 'xss-5', text: '  }', type: 'added' },
    ]
  },
  CSRF: {
    file: 'auth_guard.js',
    removedIds: [],
    added: [
      { id: 'csrf-1', text: '  if (req.method !== "GET" && !verifyCSRFToken(req)) {', type: 'added' },
      { id: 'csrf-2', text: '    throw new UnauthorizedError("CSRF_Invalid");', type: 'added' },
      { id: 'csrf-3', text: '  }', type: 'added' },
    ]
  },
  DDOS: {
    file: 'traffic_filter.py',
    removedIds: ['t4', 't5'],
    added: [
      { id: 'ddos-1', text: '        if packet.is_flood() or rate > threshold:', type: 'added' },
      { id: 'ddos-2', text: '            net.log_threat("DDoS_Detected", packet.origin)', type: 'added' },
      { id: 'ddos-3', text: '            return net.SCRUB_TRAFFIC', type: 'added' },
    ]
  },
  BOT_SWARM: {
    file: 'traffic_filter.py',
    removedIds: [],
    added: [
      { id: 'bot-1', text: '        if packet.fingerprint() in swarm_signatures:', type: 'added' },
      { id: 'bot-2', text: '            quarantine_ip(packet.origin)', type: 'added' },
      { id: 'bot-3', text: '            return net.DROP', type: 'added' },
    ]
  },
  API_ABUSE: {
    file: 'firewall.py',
    removedIds: [],
    added: [
      { id: 'api-1', text: '    if api.get_usage(request.key) > limit:', type: 'added' },
      { id: 'api-2', text: '        return net.THROTTLE_429', type: 'added' },
    ]
  },
  ZERO_DAY: {
    file: 'learning_model.py',
    removedIds: [],
    added: [
      { id: 'zd-1', text: '    if anomaly_score > threshold:', type: 'added' },
      { id: 'zd-2', text: '        isolate_subsystem(target_id)', type: 'added' },
      { id: 'zd-3', text: '        re-evaluate_weights(signature)', type: 'added' },
    ]
  },
  RANSOMWARE: {
    file: 'integrity_monitor.py',
    removedIds: ['im3'],
    added: [
      { id: 'rw-1', text: '    if detect_rapid_encryption():', type: 'added' },
      { id: 'rw-2', text: '        lock_filesystem()', type: 'added' },
      { id: 'rw-3', text: '        restore_last_good_snapshot()', type: 'added' },
      { id: 'rw-4', text: '    return True', type: 'added' },
    ]
  },
  DATA_EXFIL: {
    file: 'traffic_filter.py',
    removedIds: [],
    added: [
      { id: 'ex-1', text: '        if packet.payload_size > max_outbound:', type: 'added' },
      { id: 'ex-2', text: '            intercept_and_audit(packet)', type: 'added' },
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
    const patchInfo = MUTATION_PATCHES[type];
    
    // Stage 1: Detection
    this.emit({ 
      type: 'stage', 
      message: `SCANNED_VECTOR: Analyzing ${type.replace('_', ' ')} signature...`, 
      mutationType: type,
      stage: 'detection',
      targetFile: patchInfo.file
    });
    
    this.updateFile(patchInfo.file, { status: 'degraded' });

    await new Promise(r => setTimeout(r, 1400));

    // Stage 2: Response (Diffing)
    this.emit({ 
      type: 'stage', 
      message: `EVOLVING_LOGIC: Generating Git-diff antibodies for ${patchInfo.file}...`, 
      mutationType: type,
      stage: 'response',
      targetFile: patchInfo.file
    });

    const currentFile = this.files[patchInfo.file];
    const newLines = currentFile.lines.map(line => {
      if (patchInfo.removedIds.includes(line.id)) {
        return { ...line, type: 'removed' as const };
      }
      return line;
    });

    // Strategy: Insert additions in small bursts
    const splitIdx = Math.min(newLines.length, 3);
    const finalLines = [
      ...newLines.slice(0, splitIdx),
      ...patchInfo.added,
      ...newLines.slice(splitIdx)
    ];

    this.updateFile(patchInfo.file, { 
      lines: finalLines, 
      status: 'patched',
      lastCommit: `patch_${type.toLowerCase().slice(0, 8)}`
    });

    await new Promise(r => setTimeout(r, 2000));

    // Stage 3: Learning (Reinforce)
    this.emit({ 
      type: 'stage', 
      message: `REINFORCING: Immunity committed. Stabilizing core subsystems.`, 
      mutationType: type,
      stage: 'learning',
      targetFile: patchInfo.file
    });
    
    this.updateFile(patchInfo.file, { 
      status: 'reinforced',
      lines: finalLines.map(l => (l.type === 'added' || l.type === 'removed') ? { ...l, type: 'modified' as const } : l)
    });

    const antibodyId = `ABS-${type.slice(0, 3)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    this.memory[type] = antibodyId;
    
    await new Promise(r => setTimeout(r, 1000));
    this.emit({ type: 'success', message: `CORE_STABLE: ${type} neutralized successfully.`, stage: 'idle' });
  }
}

export const engine = new GeneSysEngine();
