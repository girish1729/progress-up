# Progress.up - HTML5 File Upload Progress indicator

![Progess.up](https://raw.githubusercontent.com/girish1729/progress.up/main//images/progress-up-logo.svg)

## What is this?

Progress-up is a HTML5 multiple files Upload plugin with progress bar
indicator.

Plugins for 

- Vue
- Svelte
- Angular
- React

are available.

This uses the [HTTP File API](https://www.w3.org/TR/FileAPI/) to show continuous progress.

>This is the very first attempt to create a clean no frills upload plugin
>in 100% Typescript. Now available for Angular, Vue, Svelte and React.

Uses the HTML input file for file uploads.

[Canonical home page](https://progress-up.live)

## What is this?

Demos are [here](https://progress-up.live/demo)

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

Go to [https://localhost:2324](https://localhost:2324)

 and try uploading files.

You may use manual upload.

__Drag and drop into the shaded area is not implemented yet.__

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

## Instructions for other frameworks


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
`

## Detailed instructions

- [Developer docs](https://progress-up.live/docs)
- [Vue](https://progress-up.live/docs/vue-docs)
- [Svelte.ts](https://progress-up.live/docs/svelte-docs)
- [Angular](https://progress-up.live/docs/angular-docs)
- [React](https://progress-up.live/docs/react-docs)

## Demos

- [Native demo](https://progress-up.live/progress-up-html5)
- [Other demos](https://progress-up.live/demo)
 

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

## Why should you care?

If you allow multiple large files upload then a progress indicator is a
cool way to give user feedback.

Nowadays HTML5 File API based progress is the best way to achieve your
goal.

This project was written ground up with latest technology as of Dec 26,
2022.

## Screencast of upload

![Progess.up screencast](https://raw.githubusercontent.com/girish1729/progress.up/main/images/progress-uploading.gif)

## Resources for file upload

- [tus.io](https://tus.io)

- [Express multer](http://expressjs.com/en/resources/middleware/multer.html)

- [HTML5 File API](https://jenkov.com/tutorials/html5/file-api.html)

- [Uploading files over HTTP
  article](https://themightyprogrammer.dev/article/uploading-files)

## Collaboration

If you wish to collaborate or send pull requests 
please get in touch using my Github profile.

If you cannot write code, then buying me a coffee can work as well.


## Alternatives

- [Uppy](https://github.com/transloadit/uppy)
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

<a href="https://twitter.com/intent/tweet?text=Tweet+this+to+your+followers&url=https%3A%2F%2Fgithub.com%2Fgirish1729%2Fprogress.up&hashtags=github&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton" target="_blank">
  <img src="http://jpillora.com/github-twitter-button/img/tweet.png"
       alt="tweet button" title="Tweet this to your followers"></img>
</a>

## Buy me a coffee to accelerate development

<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="girish1729" data-color="#f3ecec" data-emoji="" data-font="Poppins" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#000000" data-coffee-color="#FFDD00" ></script>

