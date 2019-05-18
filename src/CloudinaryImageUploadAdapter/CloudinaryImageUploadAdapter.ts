import { IImageObject } from '../models/IImageObject';
import { ISplitUrl } from '../models/ISplitUrl';

export class CloudinaryImageUploadAdapter {
  public loader: any;
  private xhr: XMLHttpRequest;
  private cloudName: string;
  private unsignedUploadPreset: string;
  private sizes?: number[];

  constructor(loader: any, cloudName: string, unsignedUploadPreset: string, sizes?: number[]) {
    this.loader = loader;
    this.xhr = new XMLHttpRequest();
    this.cloudName = cloudName;
    this.unsignedUploadPreset = unsignedUploadPreset;
    if (sizes) {
      this.sizes = sizes;
    }
  }

  public upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
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

              let images;

              if (this.sizes) {
                images = {
                  default: response.secure_url,
                  ...this.getImageSizes(response.secure_url),
                };
              } else {
                images = {
                  default: response.secure_url,
                };
              }

              resolve(images);
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
        }),
    );
  }

  public abort() {
    // This function is called to abort the request if an error occurs
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  private getImageSizes(defaultImageUrl: string): IImageObject {
    const imageObject: IImageObject = {};

    // Split url in two
    const splitUrl = this.splitUrl(defaultImageUrl);

    if (this.sizes) {
      const len = this.sizes.length;
      this.sizes.forEach((size: number, index: number) => {
        if (index !== len - 1) {
          imageObject[size.toString()] = `${splitUrl.firstHalf}w_${size}%2Cc_scale${splitUrl.secondHalf}`;
        } else {
          imageObject[size.toString()] = defaultImageUrl;
        }
      });
    }

    return imageObject;
  }

  private splitUrl(url: string): ISplitUrl {
    // This function splits the image url in two.
    const firstHalfLength = 41 + this.cloudName.length;
    const firstHalf = url.substr(0, firstHalfLength);
    const secondHalf = url.substr(firstHalfLength - 1, url.length - firstHalfLength + 1);

    return {
      firstHalf,
      secondHalf,
    };
  }
}
