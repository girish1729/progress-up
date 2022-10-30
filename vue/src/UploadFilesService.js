import axios from "axios";
import config from './config.json';

class UploadFilesService {
  upload(file, onUploadProgress) {
    let formData = new FormData();

    formData.append(config.filesArray, file);

    return axios.post(config.uploadURL, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress
    });
  }
}

export default new UploadFilesService;
