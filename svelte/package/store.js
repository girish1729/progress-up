import { writable } from 'svelte/store';
export const inputs = writable({
    uploadURL: "",
    filesName: "",
    progressType: "",
    authEnabled: false,
    authType: "",
    user: "",
    pass: "",
    fileSizeLimit: 10,
    sizeLimitType: "Single file limit",
    fileTypeAction: "Allow file type",
    filtFiles: {
        "type": "all",
        "action": "allow"
    }
});
export const uploadFileList = writable([]);
export const uploadFileInfos = writable([]);
export const errInfos = writable([]);
export const progressBars = writable([]);
export const statsTable = writable([]);
export const openTab = writable(1);
export const totalsize = writable(0);
export const totalfiles = writable(0);
export const errMsg = writable('');
