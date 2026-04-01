// Centralized API endpoint builders to avoid hardcoded paths.
const API = "/api";

export const endpoints = {
  auth: {
    checkEmail: `${API}/auth/check-email`,
    login: `${API}/auth/login`,
    register: `${API}/auth/register`,
    logout: `${API}/auth/logout`,
  },
  users: {
    list: `${API}/users`,
    byId: (userId: string) => `${API}/users/${userId}`,
  },
  issues: {
    list: `${API}/issues`,
    byId: (issueId: string) => `${API}/issues/${issueId}`,
    status: (issueId: string) => `${API}/issues/${issueId}/status`,
    applied: (issueId: string) => `${API}/issues/${issueId}/applied`,
    apply: (issueId: string) => `${API}/issues/${issueId}/apply`,
    applications: {
      list: (issueId: string) => `${API}/issues/${issueId}/applications`,
      accept: (issueId: string, appId: string) => `${API}/issues/${issueId}/applications/${appId}/accept`,
      reject: (issueId: string, appId: string) => `${API}/issues/${issueId}/applications/${appId}/reject`,
    },
  },
  sessions: {
    // POST /api/sessions — tao workspace moi (GET khong ton tai o backend)
    create: `${API}/sessions`,
    byId: (sessionId: string) => `${API}/sessions/${sessionId}`,
    byIssue: (issueId: string) => `${API}/sessions/by-issue/${issueId}`,
    complete: (sessionId: string) => `${API}/sessions/${sessionId}/complete`,
    members: {
      remove: (sessionId: string, userId: string) => `${API}/sessions/${sessionId}/members/${userId}`,
    },
    // GET va POST dung chung 1 path, phan biet bang HTTP method
    channels: (sessionId: string) => `${API}/sessions/${sessionId}/channels`,
  },
  // GET va POST dung chung 1 path
  channels: {
    messages: (channelId: string) => `${API}/channels/${channelId}/messages`,
  },
};
