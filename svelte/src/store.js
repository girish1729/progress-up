// store.js
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
})


