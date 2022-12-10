export declare const inputs: import("svelte/store").Writable<{
    uploadURL: string;
    filesName: string;
    progType: string;
    authEnabled: boolean;
    authType: string;
    user: string;
    pass: string;
    fileSizeLimit: number;
    sizeLimitType: string;
    fileTypeFilter: string;
    fileTypeAction: string;
}>;
type statsTableType = {
    id: number;
    ts: string;
    status: string;
    details: string;
};
type fileInfo = {
    file: File;
    id: string;
    ts: string;
    thumb: string;
    meta: string;
    bytesSent: string;
    rate: string;
    eta: string;
};
type errInfo = {
    file: File;
    id: string;
    ts: string;
    thumb: string;
    meta: string;
    msg: string;
};
export declare const uploadFileList: import("svelte/store").Writable<FileList>;
export declare const uploadFileInfos: import("svelte/store").Writable<fileInfo[]>;
export declare const errInfos: import("svelte/store").Writable<errInfo[]>;
export declare const progressBars: import("svelte/store").Writable<any[]>;
export declare const statsTable: import("svelte/store").Writable<statsTableType[]>;
export declare const openTab: import("svelte/store").Writable<number>;
export declare const totalsize: import("svelte/store").Writable<number>;
export declare const totalfiles: import("svelte/store").Writable<number>;
export {};
