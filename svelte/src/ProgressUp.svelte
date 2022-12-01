
<!--
<script
src="https://cdn.jsdelivr.net/npm/tus-js-client@latest/dist/tus.min.js"
defer></script>
<script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
<script
src="https://cdn.jsdelivr.net/npm/pdfobject@2.2.8/pdfobject.min.js"
defer></script>
<script type="module"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/progressBar/loading-bar.js"
defer></script>
<script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"
defer></script>

-->


<section class="dark:bg-gray-800 dark:text-white">

<div class="flex justify-end items-center space-x-2 mx-auto relative">
  <div class="w-14 h-8">

  <label onClick={darkMode} htmlFor="dark-mode" class="w-full h-full rounded-full p-1 flex justify-between cursor-pointer">
    <span class="hidden dark:inline">&#127774;</span>
    <span class="inline dark:hidden">&#127769; </span>
  </label>

  <input  type="checkbox" name="darkMode" class='hidden' />
  </div>
</div>


<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/images/progress-up-logo.svg" width="100" height="100" alt="Progress.Up HTML5 logo" />

<h2 class="text-5xl leading-tight">  HTML5 Multiple File Upload with Progress Bar 
</h2>
	<h3 class="flex justify-center text-3xl text-gray-100 mb-4
pb-4">React plugin </h3>




<!-- XXX tabs -->
<div class="bg-light p7 rounded w-9/12 mx-auto">
  <!-- Tabs -->
  <ul id="tabs" class="inline-flex pt-2 px-1 w-full border-b">

    <li class="bg-light px-4 text-dark-800 dark:text-light-800 font-semibold py-2 rounded-t border-t border-r border-l -mb-px">
	<a id="default-tab" href="#first">File upload</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#second">Setup</a>
    </li> 

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#third">Statistics</a>
    </li>

    <li class="px-4 text-dark-800 font-semibold py-2 rounded-t">
	<a href="#fourth">Help</a>
    </li>

  </ul>


<div id="tab-contents">

 <div class={openTab === 1 ? "block" : "hidden"} id="link1">
	<slot> <tab1 /> </slot>
<div class={openTab === 2 ? "block" : "hidden"} id="link2">
	<slot> <tab2 /> </slot>
<div class={openTab === 3 ? "block" : "hidden"} id="link3">
	<slot> <tab3 /> </slot>
 <div class={openTab === 4 ? "block" : "hidden"} id="link4">
	<slot> <tab4 /> </slot>
 </div>
</div>


<div id="progress-up-progressArea"> 
  {uploadFileInfos.length > 0
  ? (
  uploadFileInfos.map(({file,id, meta, ts, bytesSent, rate, eta}, index) => (

  <section key={file.name} class="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white mx-auto">
    <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-6
border-gray-300 text-gray-600 dark:text-white relative">

  <div  onClick={() => delItem(index)} title="Delete" class="absolute
cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
	<img width="25" height="25" src={trashIcon} />
  </div>

  <div class="flex flex-wrap -mx-2 mb-8">
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left
justify-left">

      		<div id="{id}-thumb">{ showThumbnail(file, index) }</div>
        </div>
      </div>

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
          <ul>
      	    <li  class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {file.name}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {ts}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {file.type}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {file.size} 
      	    </li>
       	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
	    Metadata: {meta}
      	    </li>
      	    <li class="text-xl font-light leading-relaxed text-gray-800
dark:text-white">
		<span>{bytesSent} of {file.size} uploaded  {rate} MB/s ETA {eta} s</span>
      	    </li>
          </ul>
        </div>
       </div>
  </div>

      <div class='ldBar bottom-0 right-0 pb-8' id={id} ></div>

    </div>
  </section>
 ))
): <br/> }
</div>

<div id="progress-up-errArea"> 
  {errInfos.length > 0
  ? (
  errInfos.map(({file, thumb, ts, meta, msg}, index) => (
    <section key={file.name} class="bg-red-200 m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white">
 <div class="bg-red-600 dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div title="Removed from uploads" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" />
    </div>

    <div class="flex flex-wrap -mx-2 mb-8">

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
      <div id="{id}-thumb" >{ showThumbnail(file, index) }</div>
         </div>
      </div>

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12  text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: {file.name}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: {ts}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: {file.type}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: {file.size} 
      	    </li>
       	    <li class="font-light leading-relaxed text-gray-800 dark:text-white">
	    Metadata: {meta}
      	    </li>
         </ul>
        </div>
       </div>
		{msg}
         </div>

      </div>
    </section>
 ))
): <br/> }
  </div>

</section>

<style>

/*
! tailwindcss v3.2.4 | MIT License | https://tailwindcss.com
*//*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box; /* 1 */
  border-width: 0; /* 2 */
  border-style: solid; /* 2 */
  border-color: #e5e7eb; /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured `sans` font-family by default.
5. Use the user's configured `sans` font-feature-settings by default.
*/

html {
  line-height: 1.5; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
  -moz-tab-size: 4; /* 3 */
  -o-tab-size: 4;
     tab-size: 4; /* 3 */
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */
  font-feature-settings: normal; /* 5 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.
*/

body {
  margin: 0; /* 1 */
  line-height: inherit; /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0; /* 1 */
  color: inherit; /* 2 */
  border-top-width: 1px; /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured `mono` font family by default.
2. Correct the odd `em` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */
  font-size: 1em; /* 2 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent `sub` and `sup` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0; /* 1 */
  border-color: inherit; /* 2 */
  border-collapse: collapse; /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  font-weight: inherit; /* 1 */
  line-height: inherit; /* 1 */
  color: inherit; /* 1 */
  margin: 0; /* 2 */
  padding: 0; /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
[type='button'],
[type='reset'],
[type='submit'] {
  -webkit-appearance: button; /* 1 */
  background-color: transparent; /* 2 */
  background-image: none; /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to `inherit` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1; /* 1 */
  color: #9ca3af; /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/
:disabled {
  cursor: default;
}

/*
1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block; /* 1 */
  vertical-align: middle; /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */
[hidden] {
  display: none;
}

*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
}
.pointer-events-none {
  pointer-events: none;
}
.absolute {
  position: absolute;
}
.relative {
  position: relative;
}
.inset-y-0 {
  top: 0px;
  bottom: 0px;
}
.right-0 {
  right: 0px;
}
.left-1\/2 {
  left: 50%;
}
.m-6 {
  margin: 1.5rem;
}
.mx-auto {
  margin-left: auto;
  margin-right: auto;
}
.-mx-3 {
  margin-left: -0.75rem;
  margin-right: -0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.-mb-px {
  margin-bottom: -1px;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.ml-4 {
  margin-left: 1rem;
}
.block {
  display: block;
}
.inline-block {
  display: inline-block;
}
.inline {
  display: inline;
}
.flex {
  display: flex;
}
.inline-flex {
  display: inline-flex;
}
.table {
  display: table;
}
.hidden {
  display: none;
}
.h-8 {
  height: 2rem;
}
.h-full {
  height: 100%;
}
.h-4 {
  height: 1rem;
}
.h-10 {
  height: 2.5rem;
}
.w-14 {
  width: 3.5rem;
}
.w-full {
  width: 100%;
}
.w-9\/12 {
  width: 75%;
}
.w-4 {
  width: 1rem;
}
.w-16 {
  width: 4rem;
}
.min-w-full {
  min-width: 100%;
}
.max-w-lg {
  max-width: 32rem;
}
.flex-shrink-0 {
  flex-shrink: 0;
}
.-translate-x-1\/2 {
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.cursor-pointer {
  cursor: pointer;
}
.list-outside {
  list-style-position: outside;
}
.appearance-none {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none;
}
.flex-col {
  flex-direction: column;
}
.flex-wrap {
  flex-wrap: wrap;
}
.items-center {
  align-items: center;
}
.justify-end {
  justify-content: flex-end;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}
.space-x-2 > :not([hidden]) ~ :not([hidden]) {
  --tw-space-x-reverse: 0;
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.overflow-hidden {
  overflow: hidden;
}
.overflow-x-auto {
  overflow-x: auto;
}
.whitespace-nowrap {
  white-space: nowrap;
}
.rounded-full {
  border-radius: 9999px;
}
.rounded {
  border-radius: 0.25rem;
}
.rounded-md {
  border-radius: 0.375rem;
}
.rounded-t {
  border-top-left-radius: 0.25rem;
  border-top-right-radius: 0.25rem;
}
.border {
  border-width: 1px;
}
.border-b {
  border-bottom-width: 1px;
}
.border-t {
  border-top-width: 1px;
}
.border-r {
  border-right-width: 1px;
}
.border-l {
  border-left-width: 1px;
}
.border-dashed {
  border-style: dashed;
}
.border-red-800 {
  --tw-border-opacity: 1;
  border-color: rgb(153 27 27 / var(--tw-border-opacity));
}
.border-red-500 {
  --tw-border-opacity: 1;
  border-color: rgb(239 68 68 / var(--tw-border-opacity));
}
.border-gray-200 {
  --tw-border-opacity: 1;
  border-color: rgb(229 231 235 / var(--tw-border-opacity));
}
.bg-blue-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(96 165 250 / var(--tw-bg-opacity));
}
.bg-yellow-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(234 179 8 / var(--tw-bg-opacity));
}
.bg-gray-200 {
  --tw-bg-opacity: 1;
  background-color: rgb(229 231 235 / var(--tw-bg-opacity));
}
.bg-blue-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
.bg-green-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(22 163 74 / var(--tw-bg-opacity));
}
.bg-gray-300 {
  --tw-bg-opacity: 1;
  background-color: rgb(209 213 219 / var(--tw-bg-opacity));
}
.bg-red-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
.fill-current {
  fill: currentColor;
}
.stroke-white {
  stroke: #fff;
}
.p-1 {
  padding: 0.25rem;
}
.p-4 {
  padding: 1rem;
}
.p-8 {
  padding: 2rem;
}
.p-2 {
  padding: 0.5rem;
}
.p-6 {
  padding: 1.5rem;
}
.px-1 {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
}
.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}
.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.py-2\.5 {
  padding-top: 0.625rem;
  padding-bottom: 0.625rem;
}
.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.pb-4 {
  padding-bottom: 1rem;
}
.pt-2 {
  padding-top: 0.5rem;
}
.pr-8 {
  padding-right: 2rem;
}
.pb-2 {
  padding-bottom: 0.5rem;
}
.text-left {
  text-align: left;
}
.text-5xl {
  font-size: 3rem;
  line-height: 1;
}
.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}
.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}
.font-semibold {
  font-weight: 600;
}
.font-medium {
  font-weight: 500;
}
.font-bold {
  font-weight: 700;
}
.font-light {
  font-weight: 300;
}
.uppercase {
  text-transform: uppercase;
}
.italic {
  font-style: italic;
}
.leading-tight {
  line-height: 1.25;
}
.tracking-wide {
  letter-spacing: 0.025em;
}
.text-gray-100 {
  --tw-text-opacity: 1;
  color: rgb(243 244 246 / var(--tw-text-opacity));
}
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}
.opacity-20 {
  opacity: 0.2;
}
.shadow-md {
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
.duration-150 {
  transition-duration: 150ms;
}
.duration-300 {
  transition-duration: 300ms;
}
.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.after\:h-8::after {
  content: var(--tw-content);
  height: 2rem;
}
.after\:w-8::after {
  content: var(--tw-content);
  width: 2rem;
}
.after\:rounded-full::after {
  content: var(--tw-content);
  border-radius: 9999px;
}
.after\:bg-white::after {
  content: var(--tw-content);
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}
.after\:shadow-md::after {
  content: var(--tw-content);
  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.after\:duration-300::after {
  content: var(--tw-content);
  transition-duration: 300ms;
}
.hover\:bg-blue-500:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}
.hover\:bg-yellow-600:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
.hover\:bg-red-700:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity));
}
.hover\:shadow-lg:hover {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.focus\:border-gray-500:focus {
  --tw-border-opacity: 1;
  border-color: rgb(107 114 128 / var(--tw-border-opacity));
}
.focus\:bg-blue-500:focus {
  --tw-bg-opacity: 1;
  background-color: rgb(59 130 246 / var(--tw-bg-opacity));
}
.focus\:bg-yellow-600:focus {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
.focus\:bg-red-700:focus {
  --tw-bg-opacity: 1;
  background-color: rgb(185 28 28 / var(--tw-bg-opacity));
}
.focus\:shadow-lg:focus {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus\:ring-0:focus {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}
.active\:bg-blue-600:active {
  --tw-bg-opacity: 1;
  background-color: rgb(37 99 235 / var(--tw-bg-opacity));
}
.active\:bg-yellow-700:active {
  --tw-bg-opacity: 1;
  background-color: rgb(161 98 7 / var(--tw-bg-opacity));
}
.active\:bg-red-800:active {
  --tw-bg-opacity: 1;
  background-color: rgb(153 27 27 / var(--tw-bg-opacity));
}
.active\:shadow-lg:active {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.peer:checked ~ .peer-checked\:bg-yellow-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(202 138 4 / var(--tw-bg-opacity));
}
.peer:checked ~ .peer-checked\:bg-red-600 {
  --tw-bg-opacity: 1;
  background-color: rgb(220 38 38 / var(--tw-bg-opacity));
}
.peer:checked ~ .peer-checked\:bg-green-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(74 222 128 / var(--tw-bg-opacity));
}
.peer:checked ~ .peer-checked\:after\:translate-x-6::after {
  content: var(--tw-content);
  --tw-translate-x: 1.5rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}
.dark .dark\:inline {
  display: inline;
}
.dark .dark\:hidden {
  display: none;
}
.dark .dark\:bg-gray-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity));
}
.dark .dark\:bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
}
.dark .dark\:text-white {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity));
}
@media (min-width: 640px) {

  .sm\:-mx-6 {
    margin-left: -1.5rem;
    margin-right: -1.5rem;
  }

  .sm\:px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
@media (min-width: 768px) {

  .md\:mb-0 {
    margin-bottom: 0px;
  }

  .md\:w-1\/2 {
    width: 50%;
  }

  .md\:w-1\/3 {
    width: 33.333333%;
  }
}
@media (min-width: 1024px) {

  .lg\:-mx-8 {
    margin-left: -2rem;
    margin-right: -2rem;
  }

  .lg\:px-8 {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>

<script>

/* tabs for tailwind */
let tabsContainer = document.querySelector("#tabs");
let tabTogglers = tabsContainer.querySelectorAll("#tabs a");
tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();
        let tabName = this.getAttribute("href");
        let tabContents = document.querySelector("#tab-contents");
        for (let i = 0; i < tabContents.children.length; i++) {
            tabTogglers[i].parentElement.classList.remove("border-t", "border-r", "border-l", "-mb-px", "bg-white");
            tabContents.children[i].classList.remove("hidden");
            if ("#" + tabContents.children[i].id === tabName) {
                continue;
            }
            tabContents.children[i].classList.add("hidden");
        }
        e.target.parentElement.classList.add("border-t", "border-r", "border-l", "-mb-px", "bg-white");
    });
});


/* XXX File upload tab functions */

var fileTypeIcons = {
    "video": "avi.svg",
    "css": "css.svg",
    "csv": "csv.svg",
    "eps": "eps.svg",
    "excel": "excel.svg",
    "html": "html.svg",
    "movie": "mov.svg",
    "mp3": "mp3.svg",
    "other": "other.svg",
    "pdf": "pdf.svg",
    "ppt": "ppt.svg",
    "rar": "rar.svg",
    "text": "txt.svg",
    "audio": "wav.svg",
    "word": "word.svg",
    "zip": "zip.svg"
};

/* XXX Internal variables */
var uploadFileList = [];
/* stats variables */

var progressBars = [];
var statsTable = [];
var totalfiles = 0;
var totalsize = 0;
var totaltime = 0;
var startUploadts = 0;
var endUploadts = 0;
var bytesSent = 0;
var rate = 0;
var eta = 0;

const uplform = document.querySelector("#progress-up-form form");
var upBut = document.getElementById("upButton");
uplform.addEventListener("dragover", dragOver, false);
uplform.addEventListener("drop", drop, false);

uplform.addEventListener('dragenter', (e) =>
    e.target.classList.add('bg-blue-400')
);
uplform.addEventListener('dragleave', (e) =>
    e.target.classList.remove('bg-blue-400')
);

const fileInput = document.getElementById("progress-up-fileInput");
const progressArea = document.getElementById("progress-up-progressArea");
const errArea = document.getElementById("progress-up-errArea");
const statsArea = document.getElementById("progress-up-statsArea");
const configSummary = document.getElementById("progress-up-configSummary");

uplform.addEventListener("click", () => {
    fileInput.click();
});

fileInput.onchange = ({
    target
}) => fileSelectFinish(target);

function enableUploadButton() {
    upBut.removeAttribute('disabled');
    upBut.classList.remove('opacity-20');
}

function disableUploadButton() {
    upBut.setAttribute('disabled');
    upBut.classList.add('opacity-20');
}

function clearAll() {
    progressArea.innerHTML = '';
    statsArea.innerHTML = '';
    errArea.innerHTML = '';
    configSummary.innerHTML = '';
    uploadFileList = [];
    uploadFileList = [];
    progressBars = [];
    totalfiles = 0;
    totalsize = 0;
    totaltime = 0;

    upBut.disabled = true;
    console.log("Cleared");
}

function dragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

function drop(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    var dropFiles = event.dataTransfer.files;
    uploadFileList = dropFiles;
    setupUpload();
}

function fileSelectFinish(target) {
    let selectedFiles = target.files;
    uploadFileList = selectedFiles;
    setupUpload();
}

function humanFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return ( (size / Math.pow(1024, i)).toFixed(2) * 1 +
        " " + ["B", "kB", "MB", "GB", "TB"][i]
    );
}

function setIconImage(name, type, title) {
    type = type.split('/')[0];
    console.log(type);
    var fileIcon = fileTypeIcons[type];
    if (fileIcon == undefined) {
        fileIcon = "file.svg";
    }
    var icon = [
        '<img width="125" height="125" src="',
        'https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/filetypes/' + fileIcon,
        '" alt="', name,
        '" title="', title,
        '" class="h-9 w-9" />'
    ].join('');
    document.getElementById(name).innerHTML = icon;
}

function wordCount(val) {
    var wom = val.match(/\S+/g);
    return {
        chars: val.length,
        words: wom ? wom.length : 0,
        lines: val.split(/\r*\n/).length
    };
}

function showThumbnail(f, i) {
    let id = 'a' + i;
    switch (true) {
        case /text/.test(f.type):
            console.log("Text type detected");
            var reader = new FileReader();
            reader.onload = (function(f) {
                return function(e) {
                    txt = e.target.result;
                    wc = wordCount(txt);
                    meta = document.getElementById(`${id}-meta`);
                    meta.innerHTML = (`
			Metadata: 
   			Chars : ${wc.chars}
   			Words: ${wc.words}
   			Lines: ${wc.lines}
  			`);


                    var dataArray = txt.split("\n");
                    dataArray = dataArray.slice(0, 20);
                    txt = dataArray.join("\n");
                    setIconImage(f.name, f.type, txt);
                };
            })(f);
            reader.readAsText(f);
            break;
        case /image/.test(f.type):
            console.log("Image type detected");
            var reader = new FileReader();
            // Closure to capture the file information.  
            reader.onload = (function(theFile) {
                return function(e) {
                    var thumb = [
                        '<img width="125" height="125" src="',
                        e.target.result,
                        '" title="', theFile.name,
                        '" alt="', theFile.name,
                        '" class="w-12 h-12" />'
                    ].join('');
                    document.getElementById(theFile.name).innerHTML = thumb;
                };
            })(f);
            reader.readAsDataURL(f);
            break;
        case /audio/.test(f.type):
            console.log("Audio type detected");
            var audioUrl = window.URL.createObjectURL(f);

            var icon = [
                '<audio controls width="125" height="125"><source src="',
                audioUrl,
                '" title="', name,
                '" alt="', name,
                '" class="h-9 w-9" </source> </audio>'
            ].join('');
            document.getElementById(f.name).innerHTML = icon;
            break;
        case /video/.test(f.type):
            console.log("Video type detected");
            var videoUrl = window.URL.createObjectURL(f);

            var icon = [
                '<video controls width="125" height="125"><source src="',
                videoUrl,
                '" title="', name,
                '" alt="', name,
                '" class="h-9 w-9"</source> </video>'
            ].join('');
            document.getElementById(f.name).innerHTML = icon;
            break;
        case /pdf/.test(f.type):
            console.log("PDF type detected");
            var pdfURL = window.URL.createObjectURL(f);
            var loc = document.getElementById(f.name);
            PDFObject.embed(pdfURL, loc);
            break;
        default:
            console.log("default type detected");
            setIconImage(f.name, f.type, f.name);
            break;
    }
}

function checkFilter(mime) {
    /* No filter XXX */
    if (filtFiles.type == 'all') {
        console.log("No file type filters active");
        return true;
    }
    if (mime.match(filtFiles.type) && filtFiles.action == "allow") {
        return true;
    }
    if (mime.match(filtFiles.type) && filtFiles.action == "deny") {
        return true;
    }
    return false;
}

function checkSize(size) {
    if (size <= (allowedSize * 1024 * 1024)) {
        return true;
    }
    return false;
}

function checkTotalSize() {
    if (totalsize <= (allowedTotalSize * 1024 * 1024)) {
        enableUploadButton();
        return true;
    }
    return false;
}


function printBannedBanner(errHTML, id, name, mime, ts, size, msg) {

    errHTML.push(
        `
<section class="bg-red-200 m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white">
 <div class="bg-red-600 dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div title="Removed from uploads" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25"
src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" />
    </div>

    <div class="flex flex-wrap -mx-2 mb-8">
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
		<div id="${name}"></div>
         </div>
      </div>
      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12  text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: ${name}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: ${ts}
      	    </li>
      	    <li class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: ${mime}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: ${size} 
      	    </li>
      	    <li id="${id}-meta" class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    </li>
         </ul>
        </div>
       </div>

      <div class="w-full md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-lg text-grey-dark flex items-left justify-left">
		${msg}
         </div>
	 
      </div>
    </div>

 </div>
</section>
`);

}

function createBars() {
    for (var i = 0; i < uploadFileList.length; i++) {
        var selector = '#a' + i;
        var bar = new ldBar(selector, {
            preset: progType.toLowerCase()
        });
        bar.set(0);
        progressBars.push(bar);
    }
}

function createThumbnails() {
    for (var i = 0; i < uploadFileList.length; i++) {
        f = uploadFileList[i];
        showThumbnail(f, i);
    }
}

function createSection(prog, id, i, name, ts, mime, size) {
    prog.push(
        `

<section id="${id}-section" class="m-4 p-4 mt-4 mb-4 transition-colors
text-light-100 dark:text-white">
 <div class="bg-dark dark:bg-gray dark:text-white rounded-md border border-red-800 rounded py-3 px-3 border-gray-300 text-gray-600 dark:text-white relative">

    <div  onClick="delItem(${i})" title="Delete" class="absolute cursor-pointer top-0 right-0 mr-2 dark:bg-white" >
          <img width="25" height="25" src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/trash-icon.svg" />
    </div>

    <div class="flex -mx-2 mb-8">
      <div class="w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
		<div id="${name}"></div>
         </div>
      </div>

      <div class="w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
        <div class="h-12 text-sm text-grey-dark flex items-left justify-left">
         <ul>
      	    <li  class=" font-light leading-relaxed text-gray-800
dark:text-white">
      	    Name: ${name}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Date: ${ts}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Type: ${mime}
      	    </li>
      	    <li class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    Size: ${size} 
      	    </li>
      	    <li id="${id}-meta" class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    </li>
      	    <li id="${id}-prog" class="font-light leading-relaxed text-gray-800
dark:text-white">
      	    </li>
         </ul>
        </div>
       </div>

      <div class="w-1/3 md:w-1/3 lg:w-1/4 px-2 mb-4">
         <div class="text-sm text-grey-dark flex items-left justify-left">
    		<div class='ldBar' id="${id}" ></div>
         </div>
      </div>
	 
      </div>
    </div>

 </div>
</section>
`);
}

function setupUpload() {
    var progressHTML = [];
    var errHTML = [];
    var delQ = [];
    for (var i = 0; i < uploadFileList.length; i++) {
        let f = uploadFileList[i];
        let mime = f.type;
        let name = f.name;
        let ts = f.lastModifiedDate.toLocaleDateString();
        totalsize += f.size;
        let size = humanFileSize(f.size);
        let id = 'a' + i;
        if (!checkSize(f.size)) {
            console.log("Size check:: size is " + f.size);
            msg = `${name} too big for upload`;
            console.log(msg);
            printBannedBanner(errHTML, id, name, mime, ts, size, msg);
            delQ.push(i);
            continue;
        }
        if (!checkFilter(mime)) {
            console.log("Hit banned file type:: filter issue");
            msg = `${name} cannot be uploaded due to policy.`;
            printBannedBanner(errHTML, id, name, mime, ts, size, msg);
            delQ.push(i);
            continue;
        }
        if (i == uploadFileList.length - 1) {
            console.log("Total size check:: total size is " + totalsize);
            if (!checkTotalSize()) {
                msg = `Total size exceeds policy, delete some`;
                disableUploadButton();
            }
        }
        totalfiles += 1;
        createSection(progressHTML, id, i, name, ts, mime, size);
    }

    progressArea.innerHTML = progressHTML.join('');
    errArea.innerHTML = errHTML.join('');
    createThumbnails();
    uploadFileList = uploadFileList.filter(function(value, index) {
        return delQ.indexOf(index) == -1;
    });
    createBars();
    enableUploadButton();
}

function delItem(index) {
    let list = [...uploadFileList];
    totalsize -= upLoadFileList[index].size;
    list.splice(index, 1);
    uploadFileList = list;
    el = document.getElementById('a' + index + '-section');
    el.remove();
    checkTotalSize();
}

function dumpConfigSummary() {
    if (uploadURL === undefined || filesName === undefined) {
        configSummary.innerHTML = `
	<div id="config">
		<h2 class="leading-tight pb-2">
		Please configure first
		</h2>
	</div>
	`;
        disableUploadButton();
    } else {
        configSummary.innerHTML = `
	<div id="config">
		<h2 class="leading-tight pb-2">
			&#128202; Progress type <span
class='text-sm'>${progType}</span>  
			 &#128228; Upload URL <span
class='text-sm'>${uploadURL}</span> 
		&#128218; FilesName <span
class='text-sm'>${filesName}</span>
		</h2>
	</div>
	`;
    }
}

function spitStatistics(idx) {
    if (idx == uploadFileList.length - 1) {
        endUploadts = Date.now();
        totaltime = `${endUploadts - startUploadts}`;
        totalsize = humanFileSize(totalsize);
        tot = uploadFileList.length;

        var ts = new Date().toLocaleString();
        var tot = uploadFileList.length;
        var status = totalfiles == tot ?
            '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/success-icon.svg" >' :
            '<img src="https://cdn.jsdelivr.net/gh/girish1729/progress-up/backend/public/assets/icons/misc/failure-icon.svg" >';
        var details = `${totalfiles}/${tot} files of size ${totalsize} sent in
${totaltime} ms`;
        statsArea.innerHTML = details;

        var id = statsTable.length + 1;
        statsTable.push(`

	            <tr class="bg-gray-100 border-b">
	              <td class="px-6 py-4 whitespace-nowrap text-sm
font-medium text-gray-900">${id}</td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   ${ts}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   ${status}
	              </td>
	              <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
			   ${details}
	              </td>
	            </tr>
    `);

        upBut.setAttribute('disabled', true);
        upBut.classList.add('opacity-20');
        populateStats();
        progressBars = [];
        totalfiles = 0;
        totalsize = 0;
        totaltime = 0;
        startUploadts = 0;
        endUploadts = 0;
    }
}


async function uploadOneFile(f, idx) {

    let id = 'a' + idx;
    let uplForm = new FormData();
    uplForm.append(filesName, f);
    let size = f.size;
    let p = document.getElementById(id + '-prog');
    let options = {
        onUploadProgress: function(e) {
            /*{
              loaded: number;
              total?: number;
              progress?: number; // in range [0..1]
              bytes: number; // how many bytes have been transferred since the last trigger (delta)
              estimated?: number; // estimated time in seconds
              rate?: number; // upload speed in bytes
              upload: true; // upload sign
            }*/
            let perc = parseInt(e.progress * 100);
            progressBars[idx].set(perc);
            bytesSent = humanFileSize(e.progress * size);
            Mysize = humanFileSize(size);
            eta = e.estimated;
            rate = (e.rate / 1024 / 1024).toFixed(2);

            p.innerHTML = `
		<span>${bytesSent} of ${Mysize} uploaded  ${rate} MB/s ETA ${eta} s</span>
		`;

        }
    };

    if (authEnabled) {
        var username = 'user';
        var password = 'password';
        var basicAuth = 'Basic ' + btoa(username + ':' + password);
        options['headers'] = {
            'Authorization': +basicAuth
        };
    }
    await axios.post(uploadURL, uplForm, options).then((resp) => {
        spitStatistics(idx)
    }).catch((error) => {
        alert("Upload failed to (" + uploadURL + "). Please check endpoint in Setup");
        alert(error);
    });
}

function uploadAll() {
    console.log("Starting upload...");
    startUploadts = Date.now();
    for (i = 0; i < uploadFileList.length; i++) {
        f = uploadFileList[i];
        uploadOneFile(f, i);
    }
}

/* XXX Setup tab functions */

/* XXX Globals */

var progType = "Line";
var extra = '';

/* XXX these are backend variables */
var uploadURL = 'https://run.mocky.io/v3/dfc3d264-e2bc-41f9-82b9-23b0091c5e34';
uploadURL = 'https://localhost:2324/uploadmultiple';
var filesName = "uploadFiles";
var authEnabled = false;
var authType = "Basic";
var user = '';
var pass = '';
/* Default 100 MB limit for uploads. Total as well as individual */
var fileSizeLimit = 100;
var sizeLimitType = "Single file limit";

var filtFiles = {
    "type": "all",
    "action": "allow"
};


function initApp() {
    document.getElementById("progress-up-uploadURL").value = uploadURL;
    document.getElementById("progress-up-filesName").value = filesName;
    dumpConfigSummary();
}

function applyFilter() {
    f = document.querySelector('#progress-up-filter')
    filt = f.value;
    filtType = document.querySelector('#filterAction');
    if (filtType.checked) {
        action = "deny";
    } else {
        action = "allow";
    }
    console.log(filt, action);
    switch (filt) {
        case "All":
            break;
        case "PDF only":
            filtFiles = {
                "type": "application/pdf",
                "action": action
            };
            break;
        case "Image only":
            filtFiles = {
                "type": "image",
                "action": action
            };
            break;
        case "Video only":
            filtFiles = {
                "type": "video",
                "action": action
            };
            break;
        case "Audio only":
            filtFiles = {
                "type": "audio",
                "action": action
            };
            break;
        case "Zip only":
            filtFiles = {
                "type": "application/zip",
                "action": action
            };
            break;
        case "Text only":
            filtFiles = {
                "type": "text",
                "action": action
            };
            break;
        default:
            console.log("Filter not understood");
            break;
    }

}

function toggleSizeQ() {
    val = document.querySelector('#sizeToggle');
    console.log(val.checked);
    const label = document.querySelector("#progress-up-sizeToggle");
    if (val.checked === true) {
        label.innerHTML = "Total limit";
    } else {
        label.innerHTML = "Single file limit";
    }
}

function toggleFilterQ() {
    val = document.querySelector('#filterAction');
    console.log(val.checked);
    const label = document.querySelector("#progress-up-filterLabel");
    if (val.checked === true) {
        label.innerHTML = "Deny file type";
    } else {
        label.innerHTML = "Allow file type";
    }
}


function toggleAuthQ(val) {
    const authSection = document.querySelector("#progress-up-authsection");
    authSection.classList.toggle("hidden");
}

function saveConfig() {

    uploadURL = document.getElementById("progress-up-uploadURL").value;
    filesName = document.getElementById("progress-up-filesName").value;
    if (uploadURL && filesName) {
        enableUploadButton();
    }
    authEnabled = document.getElementById("progress-up-authenable").checked;
    authType = document.getElementById("progress-up-authtype").value;
    user = document.getElementById("progress-up-username").value;
    pass = document.getElementById("progress-up-pass").value;
    fileSizeLimit = document.getElementById("fileSizeLimit").value;
    sizeLimitType = document.getElementById("sizeToggle").checked;
    fileTypeFilter = document.getElementById("progress-up-filter").value;
    typeFilterAction = document.getElementById("filterAction").checked;

    applyFilter();
    console.log(uploadURL);
    console.log(filesName);
    console.log(authEnabled);
    if (authEnabled) {
        console.log(authType);
        console.log(user, pass);
    }
    console.log(fileSizeLimit);
    console.log(sizeLimitType);
    console.log(fileTypeFilter);
    console.log(typeFilterAction);
    dumpConfigSummary();
}

async function testUpload(event) {
    console.log("Uploading using HTML5 File API...");
    let testForm = new FormData();

    const blob = new Blob(['Test upload DELETE'], {
        type: 'plain/text'
    });
    testForm.append(filesName, blob, 'progress-up-test.txt');
    let options = {};
    if (authEnabled) {
        var username = 'user';
        var password = 'password';
        var basicAuth = 'Basic ' + btoa(username + ':' + password);
        options = {
            headers: {
                'Authorization': +basicAuth
            }
        };
    }

    await axios.post(uploadURL, testForm, options).then((resp) => {
        alert("Test succeeded");
    }).catch((error) => {
        alert("Upload failed. Please check endpoint in Setup");
        alert(error);
    });
}

function testEP() {
    saveConfig();
    testUpload();
}

function setIndicator() {
    var progType = document.getElementById("progress-up-indicator").value;
    console.log(progType);
    switch (progType) {
        case "Bubble":
            extra = 'data-img-size="100,100"';
            break;
        case "Rainbow":
            extra = 'data-stroke="data:ldbar/res,gradient(0,1,#f99,#ff9)"';
            break;
        default:
            break;
    }
    dumpConfigSummary();
}

/* XXX Statistics tab functions */

function populateStats() {
    statsTableDOM = document.getElementById("progress-up-statsTable");
    statsTableDOM.innerHTML = statsTable.join('');
}

/* XXX ---------------------------------- XXX */

/* XXX third party file upload - yet to integrate */
/* XXX ---------------------------------- XXX */

/* XXX Not used */

function dataFileDnD() {
    return {
        files: [],
        fileDragging: null,
        fileDropping: null,
        humanFileSize(size) {
            const i = Math.floor(Math.log(size) / Math.log(1024));
            return (
                (size / Math.pow(1024, i)).toFixed(2) * 1 +
                " " + ["B", "kB", "MB", "GB", "TB"][i]
            );
        },
        remove(index) {
            let files = [...this.files];
            files.splice(index, 1);

            this.files = createFileList(files);
        },
        drop(e) {
            let removed, add;
            let files = [...this.files];

            removed = files.splice(this.fileDragging, 1);
            files.splice(this.fileDropping, 0, ...removed);

            this.files = createFileList(files);

            this.fileDropping = null;
            this.fileDragging = null;
        },
        dragenter(e) {
            let targetElem = e.target.closest("[draggable]");

            this.fileDropping = targetElem.getAttribute("data-index");
        },
        dragstart(e) {
            this.fileDragging = e.target
                .closest("[draggable]")
                .getAttribute("data-index");
            e.dataTransfer.effectAllowed = "move";
        },
        loadFile(file) {
            const preview = document.querySelectorAll(".preview");
            const blobUrl = URL.createObjectURL(file);

            preview.forEach(elem => {
                elem.onload = () => {
                    URL.revokeObjectURL(elem.src); // free memory
                };
            });

            return blobUrl;
        },
        addFiles(e) {
            const files = createFileList([...this.files], [...e.target.files]);
            this.files = files;
            this.form.formData.files = [...files];
        }
    };
}

function upload(event) {
    console.log("Uploading using HTML5 File API...");
    let data = new FormData();
    fetch(uploadURL, {
            method: 'POST',
            body: data
        })
        .then((result) => {
            console.log('Success:', result);
        });

}

var reader = new FileReader();
reader.onprogress = function(progressEvent) {
    if (progressEvent.lengthComputable) {
        var percentLoaded = Math.round((
            progressEvent.loaded * 100) / progressEvent.total);

        document.getElementById(name + '-1').innerHTML = fileLoaded + "%";
    }
    console.log("total: " + progressEvent.total + ", loaded: " +
        progressEvent.loaded + "(" + percentLoaded + "%)");
}


function tusUploadFile(f, filesName, endpoint) {
    var upload = new tus.Upload(file, {
        endpoint: endpoint,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: filesName,
            filetype: file.type
        },
        onError: function(error) {
            console.log("Failed because: " + error)
        },
        onProgress: function(bytesUploaded, bytesTotal) {
            var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + "%")
        },
        onSuccess: function() {
            console.log("Download %s from %s", upload.file.name, upload.url)
        }
    })

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function(previousUploads) {
        // Found previous uploads so we select the first one. 
        if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0])
        }

        // Start the upload
        upload.start()
    })
}
</script>


