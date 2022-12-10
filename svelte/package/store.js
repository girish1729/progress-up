import { writable } from 'svelte/store';
export const inputs = writable({
    uploadURL: "https://localhost:2324/uploadmultiple",
    filesName: "uploadFiles",
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
export const uploadFileList = writable([]);
export const uploadFileInfos = writable([]);
export const errInfos = writable([]);
export const progressBars = writable([]);
export const statsTable = writable([]);
export const openTab = writable(1);
export const totalsize = writable(0);
export const totalfiles = writable(0);
