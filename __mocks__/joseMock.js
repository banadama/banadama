// Minimal mock for 'jose' used by tests (CommonJS)
function base64UrlEncode(obj) {
  const s = Buffer.from(JSON.stringify(obj)).toString('base64');
  return s.replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

class SignJWT {
  constructor(payload) {
    this._payload = payload || {};
  }
  setProtectedHeader() { return this; }
  setIssuedAt() { 
    this._payload.iat = Math.floor(Date.now() / 1000);
    return this; 
  }
  setExpirationTime(val) { 
    // support values like '1h', '0s', or numeric seconds
    const now = Math.floor(Date.now() / 1000);
    if (!val) return this;
    if (typeof val === 'string') {
      const m = val.match(/^(\d+)(s|m|h|d)?$/);
      if (m) {
        const num = Number(m[1]);
        const unit = m[2] || 's';
        let seconds = num;
        if (unit === 'm') seconds = num * 60;
        if (unit === 'h') seconds = num * 60 * 60;
        if (unit === 'd') seconds = num * 60 * 60 * 24;
        this._payload.exp = now + seconds;
      }
    } else if (typeof val === 'number') {
      this._payload.exp = now + val;
    }
    return this; 
  }
  async sign() {
    const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
    const payload = base64UrlEncode(this._payload);
    return `${header}.${payload}.signature`;
  }
}

async function jwtVerify(token) {
  try {
    const parts = String(token).split('.');
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp <= now) {
      throw new Error('Token expired');
    }
    return { payload };
  } catch (e) {
    throw new Error('Invalid token');
  }
}

module.exports = { SignJWT, jwtVerify };
