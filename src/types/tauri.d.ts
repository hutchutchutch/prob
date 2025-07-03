declare global {
  interface Window {
    __TAURI__?: {
      event: {
        listen: (event: string, callback: (event: any) => void) => Promise<() => void>;
        emit: (event: string, payload?: any) => Promise<void>;
      };
    };
  }
}

export {}; 