import { Component } from '@angular/core';
import { IntroComponent } from "./components/intro/intro.component";
import { FoundersComponent } from "./components/founders/founders.component";

@Component({
  selector: 'app-root',
  imports: [IntroComponent, FoundersComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'uttara-website';
}
