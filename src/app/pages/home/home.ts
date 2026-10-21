import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { IntroComponent } from "../../components/intro/intro.component";
import { FoundersComponent } from "../../components/founders/founders.component";
import { ProjectsComponent } from "../../components/projects/projects.component";
import { ProductsComponent } from "../../components/products/products.component";
import { ContactComponent } from "../../components/contact/contact.component";

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, IntroComponent, FoundersComponent, ProjectsComponent, ProductsComponent, ContactComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}
