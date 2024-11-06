export const noop = <T = any>(data: T): T => JSON.parse(JSON.stringify(data));
