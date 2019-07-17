import { Observable } from 'rxjs';
export interface ConnectionParams {
    host: string;
    port: number;
    username: string;
    privateKey: string;
}
export declare function connect(connectionParams: ConnectionParams): Promise<unknown>;
export declare function exec(command: string): Observable<string>;
export declare function end(): Promise<unknown>;
