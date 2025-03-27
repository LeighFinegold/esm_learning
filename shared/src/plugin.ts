export interface Plugin {
    action(): void | Promise<void>;
}
