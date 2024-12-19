declare module "annyang" {
    export interface CommandObject {
      [command: string]: () => void;
    }
  
    export interface StartOptions {
      autoRestart?: boolean;
      continuous?: boolean;
    }
  
    interface Annyang {
      start(options?: StartOptions): void; // Updated to accept options
      abort(): void;
      pause(): void;
      resume(): void;
      addCommands(commands: CommandObject): void;
      removeCommands(command?: string | string[]): void;
      removeAllCommands(): void;
      addCallback(event: string, callback: (...args: any[]) => void): void;
      isListening(): boolean;
      getSpeechRecognizer(): SpeechRecognition;
      setLanguage(lang: string): void;
    }
  
    const annyang: Annyang | undefined;
    export default annyang;
  }
  