# ckeditor-Cloudinary-Upload-Adapter  [![npm version](https://badge.fury.io/js/ckeditor-cloudinary-uploader-adapter.svg)](https://badge.fury.io/js/ckeditor-cloudinary-uploader-adapter)

**This package has been deprecated in favour of [puff-puff](https://www.npmjs.com/package/puff-puff#cloudinary-uploads)**


This package is a custom image upload adapter built for [ckeditor](https://ckeditor.com/). It makes use of XHR under the hood in uploading images to cloudinary using the cloud name and upload preset you set. It was built using instructions than can be found [here](https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/upload-adapter.html) and [here](https://cloudinary.com/documentation/angular_image_and_video_upload#pure_javascript), bringing two powerful tools to work together.

## Getting Started

- Setup the editor by using steps that can be found [here](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/installation.html). If you are using a popular framework or library like Angular, you can also find instructions here. [here](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/overview.html).

- Setup your cloudinary upload preset by following steps [here](https://support.cloudinary.com/hc/en-us/articles/360004967272-Upload-Preset-Configuration). You do not need any addons except you wish to add them.

- Install ckeditor-cloudinary-image-adapter

```sh
npm i ckeditor-cloudinary-image-adapter
```

- Importing the upload adapter

```javascript
import { CloudinaryImageUploadAdapter } from 'ckeditor-cloudinary-uploader-adapter';
```

- After installing the package, you would need to setup a factory function that creates the adapter that would be added to your editor's config object. ([Please review this doc on how to setup your editor](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/overview.html)). Below is a sample function that demonstrates that. Keep in mind that depending on the frontend library or framework you use, where you place the function below may be different.

```javascript
imagePluginFactory(editor) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
    return new CloudinaryImageUploadAdapter( loader, 'your_cloud_name', 'your_unsigned_upload_preset');
  };
}
```

- Then you should add the factory function to the config's `extraPlugin` property

```javascript
const config = {
  extraPlugins: [ imagePluginFactory ],
  ...
}
```

That should get your image adapter up and running.

## Adding responsive image support

You may wish to support responsive images. This could not be easier. Simply add an array of image sizes you wish to use as the fourth parameter of the contructor. 

**Please note that you may have to use the editor to display the rich text content for reading and ensure it is not editable to see the effect of the responsive images when you resize your window.**

```javascript
imagePluginFactory(editor) {
  editor.plugins.get( 'FileRepository' ).createUploadAdapter = ( loader ) => {
    return new CloudinaryImageUploadAdapter(
      loader,
      'your_cloud_name',
      'your_unsigned_upload_preset',
      [ 160, 500, 1000, 1052 ]
     );
  };
}
```

## Documentation

### Constructor

The constructor accepts three arguments and returns a new instance of the cloudinary image adapter. Typically, you would call this constructor from a factory function that creates the upload adapter for the editor.

| Parameters | Type   | Description | Example |
|------------|--------|-------------|---------|
| loader     | Object    | The loader is a parameter provided by the ckeditor which contains things like the `file`, `total upload size`, `uploaded`. | N/A |
| cloudName  | string | This is the cloud name gotten from your cloudinary dashboard | 'MyCloud' |
| unsignedUploadPreset | string | This is the upload preset you created on cloudinary using [these steps](https://support.cloudinary.com/hc/en-us/articles/360004967272-Upload-Preset-Configuration) | 'MyPreset' |
| sizes _optional_    | number[] | This is an array of numbers that holds the sizes in px of images you wish to have in the editor. It helps ckeditor with responsive images. | [ 160, 500, 1000 ] |

### Methods

**upload**: This is a function called by ckeditor when an image has been dropped in the editor. It would upload the image to cloudinary and respond with a promise that is resolved if the request succeeds. The resolved promise would also return the cloudinary image url. If the image upload fails, the promise is rejected. This function also hooks up to the event that listens for the upload progress and feeds this data back to the editor to be displayed.
_This method takes no arguments_

**abort**: This is a function that aborts the XMLHttpRequest that is uploading the image if the upload promise is rejected or some error occurs.
_This method takes no arguments_

## Contributors

_Opeoluwa Iyi-Kuyoro_: 👨🏿[Profile](https://github.com/IyiKuyoro) - [WebSite](https://iyikuyoro.com)

## Contributions

This package is open to contributions from the community. If you find it useful or not and you feel there are some improvements to be made, feel free to raise a PR as necessary. A PR description template has been included to make that easy.

## Intended Features

- Support for signedUploadPresets
