export const queryKeys = {
  issues: {
    all: ["issues"] as const,
    detail: (id: string) => ["issues", id] as const,
    byIdea: (ideaId: string) => ["issues", "by-idea", ideaId] as const,
  },
  ideas: {
    all: ["ideas"] as const,
    detail: (id: string) => ["ideas", id] as const,
  },
  tags: {
    all: ["tags"] as const,
  },
  skills: {
    all: ["skills"] as const,
  },
};
