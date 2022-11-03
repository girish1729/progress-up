import { Component, VERSION, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  name = "ProgressUp check app";
  settings = {
    uploadURL: "http://localhost:2324/uploadmultiple",
    filesArr: "myFiles",
  };
}
