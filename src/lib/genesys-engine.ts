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
  language: 'python' | 'javascript' | 'dockerfile' | 'yaml' | 'nginx';
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
  affectedFiles?: string[];
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
    lastCommit: 'env_setup_v1.0',
    updatedAt: '2h ago',
    lines: [
      { id: 'c1', text: 'import os', type: 'keyword' },
      { id: 'c2', text: '', type: 'variable' },
      { id: 'c3', text: 'class Config:', type: 'keyword' },
      { id: 'c4', text: '    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret")', type: 'variable' },
      { id: 'c5', text: '    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:password@db:5432/appdb")', type: 'variable' },
      { id: 'c6', text: '    SQLALCHEMY_TRACK_MODIFICATIONS = False', type: 'variable' },
      { id: 'c7', text: '    REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")', type: 'variable' },
      { id: 'c8', text: '', type: 'variable' },
      { id: 'c9', text: '    RATE_LIMIT = 100', type: 'variable' },
      { id: 'c10', text: '    RATE_WINDOW = 60', type: 'variable' },
    ]
  },
  'firewall.py': {
    name: 'firewall.py',
    path: '/app/firewall.py',
    language: 'python',
    status: 'original',
    lastCommit: 'baseline_sec',
    updatedAt: '1h ago',
    lines: [
      { id: 'f1', text: 'import time', type: 'keyword' },
      { id: 'f2', text: 'from flask import request, abort, current_app', type: 'keyword' },
      { id: 'f3', text: '', type: 'variable' },
      { id: 'f4', text: 'request_log = {}', type: 'variable' },
      { id: 'f5', text: 'BLOCKED_IPS = set()', type: 'variable' },
      { id: 'f6', text: '', type: 'variable' },
      { id: 'f7', text: 'def get_ip():', type: 'function' },
      { id: 'f8', text: '    return request.headers.get("X-Forwarded-For", request.remote_addr)', type: 'variable' },
      { id: 'f9', text: '', type: 'variable' },
      { id: 'f10', text: 'def rate_limit():', type: 'function' },
      { id: 'f11', text: '    ip = get_ip()', type: 'variable' },
      { id: 'f12', text: '    now = time.time()', type: 'variable' },
      { id: 'f13', text: '    if ip in BLOCKED_IPS:', type: 'keyword' },
      { id: 'f14', text: '        abort(403)', type: 'variable' },
      { id: 'f15', text: '    # Basic in-memory rate limiting', type: 'comment' },
      { id: 'f16', text: '    if ip not in request_log:', type: 'keyword' },
      { id: 'f17', text: '        request_log[ip] = []', type: 'variable' },
      { id: 'f18', text: '    return True', type: 'keyword' },
      { id: 'f19', text: '', type: 'variable' },
      { id: 'f20', text: 'def secure_headers(response):', type: 'function' },
      { id: 'f21', text: '    response.headers["X-Content-Type-Options"] = "nosniff"', type: 'variable' },
      { id: 'f22', text: '    response.headers["X-Frame-Options"] = "DENY"', type: 'variable' },
      { id: 'f23', text: '    return response', type: 'keyword' },
    ]
  },
  'models.py': {
    name: 'models.py',
    path: '/app/models.py',
    language: 'python',
    status: 'original',
    lastCommit: 'db_schema_init',
    updatedAt: '4h ago',
    lines: [
      { id: 'm1', text: 'from .extensions import db, bcrypt', type: 'keyword' },
      { id: 'm2', text: '', type: 'variable' },
      { id: 'm3', text: 'class User(db.Model):', type: 'keyword' },
      { id: 'm4', text: '    id = db.Column(db.Integer, primary_key=True)', type: 'variable' },
      { id: 'm5', text: '    email = db.Column(db.String(120), unique=True, nullable=False)', type: 'variable' },
      { id: 'm6', text: '    password_hash = db.Column(db.String(128), nullable=False)', type: 'variable' },
      { id: 'm7', text: '    role = db.Column(db.String(20), default="user")', type: 'variable' },
      { id: 'm8', text: '', type: 'variable' },
      { id: 'm9', text: '    def set_password(self, password):', type: 'function' },
      { id: 'm10', text: '        self.password_hash = bcrypt.generate_password_hash(password).decode("utf-8")', type: 'variable' },
    ]
  },
  'auth.py': {
    name: 'auth.py',
    path: '/app/auth.py',
    language: 'python',
    status: 'original',
    lastCommit: 'jwt_logic_base',
    updatedAt: '3h ago',
    lines: [
      { id: 'a1', text: 'import jwt', type: 'keyword' },
      { id: 'a2', text: 'import datetime', type: 'keyword' },
      { id: 'a3', text: 'from flask import current_app, request', type: 'keyword' },
      { id: 'a4', text: '', type: 'variable' },
      { id: 'a5', text: 'def generate_token(user_id):', type: 'function' },
      { id: 'a6', text: '    payload = { "user_id": user_id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=2) }', type: 'variable' },
      { id: 'a7', text: '    return jwt.encode(payload, current_app.config["SECRET_KEY"], algorithm="HS256")', type: 'variable' },
    ]
  },
  'routes.py': {
    name: 'routes.py',
    path: '/app/routes.py',
    language: 'python',
    status: 'original',
    lastCommit: 'api_endpoints_v1',
    updatedAt: '5h ago',
    lines: [
      { id: 'r1', text: 'from flask import Blueprint, request, jsonify', type: 'keyword' },
      { id: 'r2', text: 'from .models import User', type: 'keyword' },
      { id: 'r3', text: 'from .extensions import db', type: 'keyword' },
      { id: 'r4', text: 'from .auth import generate_token, get_current_user', type: 'keyword' },
      { id: 'r5', text: '', type: 'variable' },
      { id: 'r6', text: 'bp = Blueprint("routes", __name__)', type: 'variable' },
      { id: 'r7', text: '', type: 'variable' },
      { id: 'r8', text: '@bp.route("/register", methods=["POST"])', type: 'function' },
      { id: 'r9', text: 'def register():', type: 'function' },
      { id: 'r10', text: '    data = request.json', type: 'variable' },
      { id: 'r11', text: '    user = User(email=data.get("email"))', type: 'variable' },
      { id: 'r12', text: '    user.set_password(data.get("password"))', type: 'variable' },
      { id: 'r13', text: '    db.session.add(user)', type: 'variable' },
      { id: 'r14', text: '    db.session.commit()', type: 'variable' },
    ]
  },
  '__init__.py': {
    name: '__init__.py',
    path: '/app/__init__.py',
    language: 'python',
    status: 'original',
    lastCommit: 'factory_pattern',
    updatedAt: '6h ago',
    lines: [
      { id: 'i1', text: 'from flask import Flask', type: 'keyword' },
      { id: 'i2', text: 'from .config import Config', type: 'keyword' },
      { id: 'i3', text: 'from .extensions import db, bcrypt', type: 'keyword' },
      { id: 'i4', text: 'from .routes import bp', type: 'keyword' },
      { id: 'i5', text: '', type: 'variable' },
      { id: 'i6', text: 'def create_app():', type: 'function' },
      { id: 'i7', text: '    app = Flask(__name__)', type: 'variable' },
      { id: 'i8', text: '    app.config.from_object(Config)', type: 'variable' },
      { id: 'i9', text: '    db.init_app(app)', type: 'variable' },
      { id: 'i10', text: '    bcrypt.init_app(app)', type: 'variable' },
      { id: 'i11', text: '    app.register_blueprint(bp)', type: 'variable' },
      { id: 'i12', text: '    return app', type: 'keyword' },
    ]
  },
  'run.py': {
    name: 'run.py',
    path: '/run.py',
    language: 'python',
    status: 'original',
    lastCommit: 'entry_point',
    updatedAt: '1h ago',
    lines: [
      { id: 'run1', text: 'from app import create_app', type: 'keyword' },
      { id: 'run2', text: 'from app.extensions import db', type: 'keyword' },
      { id: 'run3', text: '', type: 'variable' },
      { id: 'run4', text: 'app = create_app()', type: 'variable' },
      { id: 'run5', text: '', type: 'variable' },
      { id: 'run6', text: 'if __name__ == "__main__":', type: 'keyword' },
      { id: 'run7', text: '    app.run(host="0.0.0.0", port=5000)', type: 'variable' },
    ]
  },
  'docker-compose.yml': {
    name: 'docker-compose.yml',
    path: '/docker-compose.yml',
    language: 'yaml',
    status: 'original',
    lastCommit: 'container_orchestration',
    updatedAt: '2h ago',
    lines: [
      { id: 'd1', text: 'version: "3.9"', type: 'keyword' },
      { id: 'd2', text: 'services:', type: 'keyword' },
      { id: 'd3', text: '  web:', type: 'variable' },
      { id: 'd4', text: '    build: .', type: 'variable' },
      { id: 'd5', text: '    ports:', type: 'variable' },
      { id: 'd6', text: '      - "5000:5000"', type: 'variable' },
      { id: 'd7', text: '  db:', type: 'variable' },
      { id: 'd8', text: '    image: postgres:15', type: 'variable' },
      { id: 'd9', text: '  redis:', type: 'variable' },
      { id: 'd10', text: '    image: redis:7', type: 'variable' },
    ]
  },
  'nginx.conf': {
    name: 'nginx.conf',
    path: '/nginx.conf',
    language: 'nginx',
    status: 'original',
    lastCommit: 'reverse_proxy',
    updatedAt: '3h ago',
    lines: [
      { id: 'n1', text: 'events {}', type: 'keyword' },
      { id: 'n2', text: 'http {', type: 'keyword' },
      { id: 'n3', text: '    server {', type: 'keyword' },
      { id: 'n4', text: '        listen 80;', type: 'variable' },
      { id: 'n5', text: '        location / {', type: 'variable' },
      { id: 'n6', text: '            proxy_pass http://web:5000;', type: 'variable' },
      { id: 'n7', text: '        }', type: 'variable' },
      { id: 'n8', text: '    }', type: 'variable' },
      { id: 'n9', text: '}', type: 'keyword' },
    ]
  }
};

interface FilePatch {
  file: string;
  added: CodeLine[];
  removedIds: string[];
}

const MUTATION_PATCHES: Record<MutationType, FilePatch[]> = {
  SQL_INJECTION: [
    {
      file: 'models.py',
      removedIds: [],
      added: [
        { id: 'sqli-1', text: '    @staticmethod', type: 'added' },
        { id: 'sqli-2', text: '    def safe_find_by_email(email):', type: 'added' },
        { id: 'sqli-3', text: '        # Use bind parameters to prevent SQLi', type: 'added' },
        { id: 'sqli-4', text: '        return User.query.filter_by(email=email).first()', type: 'added' },
      ]
    },
    {
      file: 'routes.py',
      removedIds: ['r11'],
      added: [
        { id: 'sqli-5', text: '    # Switched to hardened search method', type: 'added' },
        { id: 'sqli-6', text: '    user = User.safe_find_by_email(data.get("email"))', type: 'added' },
      ]
    }
  ],
  XSS: [
    {
      file: 'firewall.py',
      removedIds: [],
      added: [
        { id: 'xss-1', text: 'def secure_headers(response):', type: 'added' },
        { id: 'xss-2', text: '    response.headers["X-Content-Type-Options"] = "nosniff"', type: 'added' },
        { id: 'xss-3', text: '    response.headers["X-Frame-Options"] = "DENY"', type: 'added' },
        { id: 'xss-4', text: '    response.headers["X-XSS-Protection"] = "1; mode=block"', type: 'added' },
        { id: 'xss-5', text: '    return response', type: 'added' },
      ]
    },
    {
      file: 'routes.py',
      removedIds: [],
      added: [
        { id: 'xss-6', text: 'from .firewall import secure_headers', type: 'added' },
        { id: 'xss-7', text: '', type: 'added' },
        { id: 'xss-8', text: '@bp.after_request', type: 'added' },
        { id: 'xss-9', text: 'def apply_xss_protection(response):', type: 'added' },
        { id: 'xss-10', text: '    return secure_headers(response)', type: 'added' },
      ]
    }
  ],
  CSRF: [
    {
      file: 'firewall.py',
      removedIds: [],
      added: [
        { id: 'csrf-1', text: 'def validate_csrf():', type: 'added' },
        { id: 'csrf-2', text: '    token = request.headers.get("X-CSRF-Token")', type: 'added' },
        { id: 'csrf-3', text: '    if not token or not verify_csrf(token):', type: 'added' },
        { id: 'csrf-4', text: '        abort(403, "CSRF Token missing or invalid")', type: 'added' },
      ]
    },
    {
      file: 'config.py',
      removedIds: [],
      added: [
        { id: 'csrf-5', text: '    WTF_CSRF_ENABLED = True', type: 'added' },
        { id: 'csrf-6', text: '    CSRF_TIME_LIMIT = 3600', type: 'added' },
      ]
    }
  ],
  DDOS: [
    {
      file: 'firewall.py',
      removedIds: ['f15', 'f16', 'f17'],
      added: [
        { id: 'redis-1', text: 'import redis', type: 'added' },
        { id: 'redis-2', text: 'r = redis.Redis.from_url(current_app.config["REDIS_URL"])', type: 'added' },
        { id: 'redis-3', text: '', type: 'added' },
        { id: 'redis-4', text: 'def rate_limit():', type: 'added' },
        { id: 'redis-5', text: '    ip = get_ip()', type: 'added' },
        { id: 'redis-6', text: '    key = f"rate:{ip}"', type: 'added' },
        { id: 'redis-7', text: '    count = r.incr(key)', type: 'added' },
        { id: 'redis-8', text: '    if count == 1: r.expire(key, 60)', type: 'added' },
        { id: 'redis-9', text: '    if count > 100: abort(429, "Too many requests")', type: 'added' },
      ]
    },
    {
      file: 'config.py',
      removedIds: [],
      added: [
        { id: 'redis-10', text: '    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")', type: 'added' },
      ]
    }
  ],
  BOT_SWARM: [
    {
      file: 'firewall.py',
      removedIds: [],
      added: [
        { id: 'bot-1', text: 'def detect_bot_signature():', type: 'added' },
        { id: 'bot-2', text: '    ua = request.headers.get("User-Agent")', type: 'added' },
        { id: 'bot-3', text: '    if "headless" in ua.lower() or "phantomjs" in ua.lower():', type: 'added' },
        { id: 'bot-4', text: '        BLOCKED_IPS.add(get_ip())', type: 'added' },
        { id: 'bot-5', text: '        abort(403, "Bot Signature Detected")', type: 'added' },
      ]
    }
  ],
  API_ABUSE: [
    {
      file: 'config.py',
      removedIds: ['c9'],
      added: [
        { id: 'api-1', text: '    # Tightened Rate Limit for API Abuse Prevention', type: 'added' },
        { id: 'api-2', text: '    RATE_LIMIT = 20', type: 'added' },
        { id: 'api-3', text: '    API_QUOTA_PER_HOUR = 1000', type: 'added' },
      ]
    }
  ],
  ZERO_DAY: [
    {
      file: 'routes.py',
      removedIds: [],
      added: [
        { id: 'zd-1', text: 'from .roles import require_role', type: 'added' },
        { id: 'zd-2', text: '', type: 'added' },
        { id: 'zd-3', text: '@bp.route("/admin/emergency_shutdown", methods=["POST"])', type: 'added' },
        { id: 'zd-4', text: '@require_role("admin")', type: 'added' },
        { id: 'zd-5', text: 'def zero_day_lockdown():', type: 'added' },
        { id: 'zd-6', text: '    current_app.config["MAINTENANCE_MODE"] = True', type: 'added' },
        { id: 'zd-7', text: '    return jsonify({"status": "CORE_LOCKED"})', type: 'added' },
      ]
    }
  ],
  RANSOMWARE: [
    {
      file: 'firewall.py',
      removedIds: [],
      added: [
        { id: 'rw-1', text: 'def validate_payload():', type: 'added' },
        { id: 'rw-2', text: '    if request.content_length and request.content_length > 10_000:', type: 'added' },
        { id: 'rw-3', text: '        abort(413, "Payload too large - Possible encryption flood")', type: 'added' },
      ]
    }
  ],
  DATA_EXFIL: [
    {
      file: 'auth.py',
      removedIds: [],
      added: [
        { id: 'ex-1', text: 'def monitor_exfiltration():', type: 'added' },
        { id: 'ex-2', text: '    # Monitor unusual token activity', type: 'added' },
        { id: 'ex-3', text: '    if get_token_usage_count(get_current_user()) > 50:', type: 'added' },
        { id: 'ex-4', text: '        revoke_token(request.headers.get("Authorization"))', type: 'added' },
        { id: 'ex-5', text: '        abort(401, "Unusual data access patterns detected")', type: 'added' },
      ]
    }
  ]
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
    const patches = MUTATION_PATCHES[type] || [];
    if (patches.length === 0) return;

    const affectedFiles = patches.map(p => p.file);
    
    // Stage 1: Detection (All files)
    this.emit({ 
      type: 'stage', 
      message: `SCANNED_VECTOR: [${type}] Analyzing cross-script anomalies...`, 
      mutationType: type,
      stage: 'detection',
      affectedFiles,
      targetFile: affectedFiles[0]
    });
    
    affectedFiles.forEach(file => {
      this.updateFile(file, { status: 'degraded' });
    });

    await new Promise(r => setTimeout(r, 1200));

    // Stage 2: Response (Apply Diffs in Parallel)
    this.emit({ 
      type: 'stage', 
      message: `GENESIS_ENGINE: Injecting multi-script antibodies into system nodes...`, 
      mutationType: type,
      stage: 'response',
      affectedFiles,
      targetFile: affectedFiles[0]
    });

    patches.forEach(patch => {
      const currentFile = this.files[patch.file];
      if (!currentFile) return;

      let newLines: CodeLine[] = [];
      currentFile.lines.forEach(line => {
        if (patch.removedIds.includes(line.id)) {
          newLines.push({ ...line, type: 'removed' as const });
        } else {
          newLines.push(line);
        }
      });

      const insertIdx = Math.max(0, newLines.findIndex(l => l.type === 'removed') || newLines.length - 1);
      newLines.splice(insertIdx + 1, 0, ...patch.added);

      this.updateFile(patch.file, { 
        lines: newLines, 
        status: 'patched',
        lastCommit: `hotpatch_${type.toLowerCase().slice(0, 10)}`
      });
    });

    await new Promise(r => setTimeout(r, 1800));

    // Stage 3: Learning (Reinforce All)
    this.emit({ 
      type: 'stage', 
      message: `HEALED: Reinforcing structural integrity across ${affectedFiles.length} files.`, 
      mutationType: type,
      stage: 'learning',
      affectedFiles,
      targetFile: affectedFiles[0]
    });
    
    patches.forEach(patch => {
      const fileObj = this.files[patch.file];
      const reinforcedLines = fileObj.lines
        .filter(l => l.type !== 'removed')
        .map(l => (l.type === 'added') ? { ...l, type: 'modified' as const } : l);

      this.updateFile(patch.file, { 
        status: 'reinforced',
        lines: reinforcedLines
      });
    });

    const antibodyId = `ABS-${type.slice(0, 3)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    this.memory[type] = antibodyId;
    
    await new Promise(r => setTimeout(r, 800));
    this.emit({ type: 'success', message: `CORE_STABLE: Cross-node recovery complete. Active defense pattern stored.`, stage: 'idle' });
  }
}

export const engine = new GeneSysEngine();
