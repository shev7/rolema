export default {
  language: "lng",
  lifetimes: {
    language: 60 * 24 * 30,
    session: 60 * 60 * 24 * 30,
  },
  session: "session",
  project: "project",
  appearance: "appearance",
} as const;
