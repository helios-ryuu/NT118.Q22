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
  },
};
