/// <reference types="node" />
import { Stream } from 'stream';
import { FfprobeData, FfprobeCallback } from './interfaces';
/**
 *
 * Run ffprobe on specified input
 * @param src FilePath / URL / Readable Stream
 */
export declare function ffprobe(input: string | Stream): Promise<FfprobeData>;
export declare namespace ffprobe {
    var path: string;
}
export declare function ffprobe(input: string | Stream, cb: FfprobeCallback): void;
export declare namespace ffprobe {
    var path: string;
}
/**
 * @deprecated
 */
declare function ffprobeSyncDeprecated(input: string): FfprobeData;
/**
 * Return ffprobe info object for the specified file
 * @deprecated Use async versions
 */
export declare const ffprobeSync: typeof ffprobeSyncDeprecated;
export {};
