import { writable } from 'svelte/store';

export const inputs = writable({
        uploadURL: "",
        filesName: "",
        progType: "Line",
        authEnabled: false,
        authType: "",
        user: "",
        pass: "",
        fileSizeLimit: 10,
        sizeLimitType: "Single file limit",
        fileTypeFilter: "All",
        fileTypeAction: "Allow file type"
});

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

export const uploadFileList = writable<FileList> ([]);
export const uploadFileInfos = writable<fileInfo[]> ([]);
export const errInfos = writable<errInfo[]> ([]);
export const progressBars = writable<any[]> ([]);
export const statsTable = writable<statsTableType[]> ([]);
export const openTab = writable(1);
export const totalsize = writable(0);
export const totalfiles = writable(0);
export const errMsg = writable('');

