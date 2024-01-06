"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const stream_1 = require("stream");
const util_1 = require("util");
const args = [
    '-v',
    'quiet',
    '-print_format',
    'json',
    '-show_format',
    '-show_streams',
    '-show_error',
    '-i'
];
ffprobe.path = 'ffprobe';
/**
 * @internal
 */
const parseStdout = (stdout) => {
    let value;
    try {
        value = JSON.parse(stdout);
        if ('format' in value) {
            return { value };
        }
        if ('error' in value) {
            return { error: new Error(value.error.string) };
        }
        else {
            return { error: new Error('No data available') };
        }
    }
    catch (error) {
        return { error };
    }
};
/**
 * @internal
 */
const ffprobePromise = (input) => {
    return new Promise((resolve, reject) => {
        const buffer = [];
        let spawned;
        if (typeof input === 'string') {
            spawned = child_process_1.spawn(process.env.FFPROBE_PATH || ffprobe.path, [...args, input]);
        }
        else if (isStream(input)) {
            spawned = child_process_1.spawn(process.env.FFPROBE_PATH || ffprobe.path, [...args, 'pipe:0']);
            input.once('error', reject);
            input.pipe(spawned.stdin);
        }
        else {
            reject(new TypeError('Provided argument is neither a string nor a stream'));
        }
        spawned.once('error', reject);
        spawned.stdout.on('data', chunk => buffer.push(chunk));
        spawned.stdout.once('end', () => {
            const data = parseStdout(buffer.join(''));
            data.error ? reject(data.error) : resolve(data.value);
        });
    });
};
function ffprobe(input, cb) {
    if (cb) {
        ffprobePromise(input)
            .then(data => cb(null, data))
            .catch(cb);
    }
    else {
        return ffprobePromise(input);
    }
}
exports.ffprobe = ffprobe;
function isStream(input) {
    return input instanceof stream_1.Stream && typeof input._read === 'function';
}
/**
 * @deprecated
 */
function ffprobeSyncDeprecated(input) {
    const { error, stdout } = child_process_1.spawnSync(process.env.FFPROBE_PATH || ffprobe.path, [...args, input]);
    if (error) {
        throw error;
    }
    const data = parseStdout(stdout.toString());
    if (data.error) {
        throw data.error;
    }
    return data.value;
}
/**
 * Return ffprobe info object for the specified file
 * @deprecated Use async versions
 */
exports.ffprobeSync = util_1.deprecate(ffprobeSyncDeprecated, 'ffprobeSync() is deprecated.');
