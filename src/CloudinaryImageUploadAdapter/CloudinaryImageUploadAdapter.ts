export class CloudinaryImageUploadAdapter {
  public loader: any;
  private xhr: XMLHttpRequest;
  private cloudName: string;
  private unsignedUploadPreset: string;

  constructor(loader: any, cloudName: string, unsignedUploadPreset: string) {
    this.loader = loader;
    this.xhr = new XMLHttpRequest();
    this.cloudName = cloudName;
    this.unsignedUploadPreset = unsignedUploadPreset;
  }

  public upload() {
    return this.loader.file
      .then( (file: File) => new Promise((resolve, reject) => {
        const fd = new FormData();
        const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
        this.xhr.open('POST', url, true);
        this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

        // Hookup an event listener to update the upload progress bar
        this.xhr.upload.addEventListener('progress', e => {
          this.loader.uploadTotal = 100;
          this.loader.uploaded = Math.round((e.loaded * 100) / e.total);
        });

        // Hookup a listener to listen for when the request state changes
        this.xhr.onreadystatechange = () => {
          if (this.xhr.readyState === 4 && this.xhr.status === 200) {
            // Successful upload, resolve the promise with the new image
            const response = JSON.parse(this.xhr.responseText);
            const cloudImageUrl = response.secure_url;

            resolve({
              default: cloudImageUrl
            });
          } else if (this.xhr.status !== 200) {
            // Unsuccessful request, reject the promise
            reject('Upload failed');
          }
        };

        // Setup the form data to be sent in the request
        fd.append('upload_preset', this.unsignedUploadPreset);
        fd.append('tags', 'browser_upload');
        fd.append('file', file);
        this.xhr.send(fd);
      }));
  }

  public abort() {
    // This function is called to abort the request if an error occurs
    if ( this.xhr ) {
      this.xhr.abort();
    }
  }
}
