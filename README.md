# Progress.up HTML5 File Upload Progress indicator

![Progess.up](https://raw.githubusercontent.com/girish1729/progress.up/main/html5-upload/images/Progress.Up.png)

## What is this?

This is a HTML5 multiple files Upload plugin with progress bar
indicator.

This uses the HTTP File API protocol to show continuous progress.


## Screenshot

![Progess.up
screenshot](https://raw.githubusercontent.com/girish1729/progress.up/main/html5-upload/images/progress-up-html5-upload-capture.png)

## Why should you care?

If you allow multiple large files upload then a progress indicator is a
cool way to give user feedback.

## How to build and run

```
$ git clone https://github.com/girish1729/progress.up
$ cd progress.up/html5-upload
$ yarn install

# or

$ npm install

$ npm start
```

Go to [http://localhost:2324](http://localhost:2324)
 and try uploading files.

You may use manual upload or drag and drop into the shaded area.

The uploaded files are present in `html5-upload/uploads` folder.

## Backend

This backend is [express.js](https://expressjs.com) with [multer
middleware](http://expressjs.com/en/resources/middleware/multer.html)

We require a backend that accepts `multipart/form-data` as upload
protocol.

Also the name of the `<input type='file` attribute should `myFiles`.

## Frontend - the plugin itself

It is using the HTML5 File API.

This is a clean way to get progress indicator for file uploads.

Plugins for [Vue.js](https://www.vuejs.org), [Angular
12](https://angular.io) and [React JS](https://reactjs.org) are on the way.

## Contact

You can [Tweet me](https://twitter.com/girish1729) for help/suggestions.

You can [follow me](https://twitter.com/intent/follow?screen_name=girish1729
) for updates.

## Tweet this to followers


<a href="https://twitter.com/intent/tweet?text=Tweet+this+to+your+followers&url=https%3A%2F%2Fgithub.com%2Fgirish1729%2Fprogress.up&hashtags=github&original_referer=http%3A%2F%2Fgithub.com%2F&tw_p=tweetbutton" target="_blank">
  <img src="http://jpillora.com/github-twitter-button/img/tweet.png"
       alt="tweet button" title="Tweet this to your followers"></img>
</a>

## Buy me a coffee to accelerate development

<a href="https://www.buymeacoffee.com/girish1729" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>

