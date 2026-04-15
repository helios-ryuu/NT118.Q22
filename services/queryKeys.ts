export const queryKeys = {
  issues: {
    all: ["issues"] as const,
    mine: ["issues", "mine"] as const,
    detail: (id: string) => ["issues", id] as const,
    byIdea: (ideaId: string) => ["issues", "by-idea", ideaId] as const,
  },
  ideas: {
    all: ["ideas"] as const,
    detail: (id: string) => ["ideas", id] as const,
  },
  comments: {
    byIdea: (ideaId: string) => ["comments", "by-idea", ideaId] as const,
  },
  conversations: {
    all: ["conversations"] as const,
    messages: (conversationId: string) => ["conversations", "messages", conversationId] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    unreadCount: ["notifications", "unread-count"] as const,
  },
  users: {
    detail: (id: string) => ["users", id] as const,
  },
  tags: {
    all: ["tags"] as const,
  },
  skills: {
    all: ["skills"] as const,
  },
};
