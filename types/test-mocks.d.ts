declare module '@/lib/db' {
  const db: any;
  export { db };
}

declare global {
  var __MOCK_DB__: any;
}

export {};
