export const queryKeys = {
  issues: {
    all: ["issues"] as const,
    detail: (id: string) => ["issues", id] as const,
  },
};
