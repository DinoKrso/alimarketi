export type FormState =
  | { kind: "idle" }
  | { kind: "error"; text: string; fields: string[] }
  | { kind: "sent"; text: string }
  | { kind: "offline"; text: string };

export const idleForm: FormState = { kind: "idle" };

export const CV_MAX_BYTES = 4 * 1024 * 1024;
