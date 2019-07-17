/**
 * rsync exec
 * @param src : string /path/to/source
 * @param dest : string server:/path/to/dest
 */
export declare function exec(src: string, dest: string, privateKey: string, flags?: string): Promise<unknown>;
