import axios from 'utils/axios';
import { base64ToFile } from '../utils/file';

const upload = payload => {
  const formData = new FormData();

  formData.append('file', base64ToFile(payload.url, payload.fileName, payload.fileType), payload.fileName, { type: payload.fileType });

  return axios.post('/file/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(
    res => {
      return res.data;
    }
  ).catch((e) => {
    return e.response.data;
  });
};

export const File = {
  upload
};
