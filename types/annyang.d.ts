declare module "annyang" {
    export interface CommandObject {
      [command: string]: () => void;
    }
  
    interface Annyang {
      start(): void;
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
  