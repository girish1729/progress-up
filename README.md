# Progress-up - File Uploader for HTTPS

![Progess-up](https://raw.githubusercontent.com/girish1729/progress.up/main/images/progress-up-logo.svg)

## What is this?

Progress-up is a HTTPS multiple files Upload plugin with progress bar
indicator.

There is support for 10 types of progress displays.

![Progess-up progress types](https://raw.githubusercontent.com/girish1729/progress.up/main/backend/public/images/progress-types.png)


> Plugins for Angular, Svelte, Vue and React

This uses the [HTTP File API](https://www.w3.org/TR/FileAPI/) to show continuous progress.

>This is the very first attempt to create a clean no frills upload plugin
>in 100% Typescript. Now available for Angular, Vue, Svelte and React.

Uses the HTML input file for file uploads.

[Canonical home page](https://progress-up.live)

## Demo

 [Live demo](https://luxury-kangaroo-af6a24.netlify.app/)
 

Other demos are [here](https://progress-up.live/demo)

## Configuration

There are two types of configuration in Progress-up.

- Static config.json with one time values
- Dynamic config with runtime form filling

A sample static config is `config.json` inside the root directory of
proect.

```json

{
         "uploadURL": "https://localhost:2324/uploadmultiple",
         "filesName": "uploadFiles",
         "progressType": "Line"
}
  
```

You can choose one of 10 progress types.


- Line
- Fan
- Bubble
- Energy
- Rainbow
- Stripe
- Text
- Circle


## How to build and run as plain js

### The backend is [CORS enabled](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

So you don't have to deal with pesky same origin security errors with
file uploads. Also each plugin enables you to name the file array in the
HTML `<input>` file selector.

By specifying backend URL and file name in `input HTML element` file
upload is no longer a hassle.

With that out of the way let us focus on the frontend.

```shell
$ git clone https://github.com/girish1729/progress.up

$ cd progress.up/backend
$ yarn install

# or

$ npm install

$ mkdir uploads

$ npm start
```

You also need live-server.

```shell
# npm install -g live-server
```

Go to [https://localhost:2324](https://localhost:2324)

 and try uploading files.

You may use manual upload.

The uploaded files are present in `backend/uploads` folder.

## Backend

This backend is [Node.js HTTP server express.js](https://expressjs.com) with [multer middleware](http://expressjs.com/en/resources/middleware/multer.html)

> This ensures that this code is platform agnostic.
> Most issues with file upload plugins extant today hover around
> not specifying backend correctly. Not making it easy to use.
> Not explaining what should be the input file name attribute etc.
> 

We require a backend that accepts `multipart/form-data` as upload
protocol.

Also the name of the `<input type='file` attribute should `myFiles`.

## Frontend - the plugin itself

It is using the HTML5 File API.

This is a clean way to get progress indicator for file uploads.

## Instructions for Angular, Vue, Svelte and React


```shell
	$ npm install progress-up-angular
# or 
	$ yarn add progress-up-angular
```
### Vue 3

```shell
	$ npm install progress-up-vue
# or 
	$ yarn add progress-up-vue
```
### React.js

```shell
	$ npm install progress-up-react
# or 
	$ yarn add progress-up-react
```
### Svelte

```shell
	$ npm install progress-up-svelte
# or 
	$ yarn add progress-up-svelte
```


## Detailed instructions

- [Developer docs](https://progress-up.live/docs)
- [Vue](https://progress-up.live/docs/vue-docs)
- [Svelte.ts](https://progress-up.live/docs/svelte-docs)
- [Angular](https://progress-up.live/docs/angular-docs)
- [React](https://progress-up.live/docs/react-docs)

## Screenshots gallery

Some are here. For complete list 
[go here](https://progress-up.live/screenshots)

### Video of drag and drop

 ![Video of Drag and drop](https://raw.githubusercontent.com/girish1729/progress.up/main/images/dnd.gif)

### Video of upload 

 ![Video of upload](https://raw.githubusercontent.com/girish1729/progress.up/main/images/progress-video.gif)

### Dark mode

 ![Dark mode](https://raw.githubusercontent.com/girish1729/progress.up/main/images/progress-up-darkmode.png)

### Preview before upload

 ![Preview](https://raw.githubusercontent.com/girish1729/progress.up/main/images/progress-up-preview2.png)

### Fully uploaded view

 ![Fully uploaded](https://raw.githubusercontent.com/girish1729/progress.up/main/images/progress-up-fullyuploaded.png)


## Why should you care?

If you allow multiple large files upload then a progress indicator is a
cool way to give user feedback.

Nowadays HTML5 File API based progress is the best way to achieve your
goal.

There is support for blocking uploads based on total size, individual
size and MIME type.

## Screencast of upload

![Progess.up screencast](https://raw.githubusercontent.com/girish1729/progress.up/main/images/progress-uploading.gif)

## Resources for file upload

- [tus.io](https://tus.io)

- [Express multer](http://expressjs.com/en/resources/middleware/multer.html)

- [HTML5 File API](https://jenkov.com/tutorials/html5/file-api.html)

- [Uploading files over HTTP
  article](https://themightyprogrammer.dev/article/uploading-files)

## Testimonials 

![Testimonial from
Staylight](https://raw.githubusercontent.com/girish1729/progress.up/main/images/testimonial-staylight.png)


## Collaboration

If you wish to collaborate or send pull requests 
please get in touch using my Github profile.

If you cannot write code, then buying me a coffee can work as well.


## Alternatives

- [Uppy](https://github.com/transloadit/uppy)
- [UploadThing](https://uploadthing.com/)
- [DropIt](https://github.com/ThalKod/DropIt)
- [Resumable.js](https://github.com/23/resumable.js)
- [Filepond](https://github.com/pqina/filepond)
- [Krajee bootstrap file input](https://github.com/kartik-v/bootstrap-fileinput)
- [Dropzone](https://github.com/dropzone/dropzone)

## Contact

You can [DM me on Twitter](https://twitter.com/girish1729) for help/suggestions.

You can [follow me](https://twitter.com/intent/follow?screen_name=girish1729
) for updates.

## Tweet this to followers

<a class="twitter-share-button mr-10" href="https://twitter.com/intent/tweet?text=Tweet+this+to+your+followers&url=https%3A%2F%2Fgithub.com%2Fgirish1729%2Fprogress.up&hashtags=github&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton" target="_blank" data-size="large">
       <img src="https://raw.githubusercontent.com/girish1729/progress.up/main//images/tweet.png" alt="Tweet this" />
</a>

## Sponsor me using crypto

[<img src="https://api.gitsponsors.com/api/badge/img?id=551807140" height="20">](https://api.gitsponsors.com/api/badge/link?p=v4LeMgCHEaLKwZ2rJnh+sAEPZt9WWjd0Zk+JyY37F7EbI9XoLtVVtfZMfesmkLXKqJj2LKAZ3JsN6QZ/XwlS77aH6Ckx222Da3WQN9LSow4HcUL+WJ84jn95CDSf4nY27mr9p9HhklpRepHrosBexw==)



## Buy me a coffee to accelerate development

<a href="https://www.buymeacoffee.com/girish1729" target="_blank"><img
src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

