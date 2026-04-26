import { Component } from '@angular/core';
import { IntroComponent } from "./components/intro/intro.component";
import { FoundersComponent } from "./components/founders/founders.component";
import { ProjectsComponent } from "./components/projects/projects.component";
import { ContactComponent } from "./components/contact/contact.component";
import { HeaderComponent } from "./components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [IntroComponent, FoundersComponent, ProjectsComponent, ContactComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'uttara-website';
}
