import { Component } from "@angular/core";
import { ProgressUpModule } from 'progress-up';

@Component({
  selector: "my-app",
  templateUrl: "app.component.html"
})

export class AppComponent {
  name = "ProgressUp check app";
  settings = {
    uploadURL: "http://localhost:2324/uploadmultiple",
    filesArr: "myFiles",
  };
}
