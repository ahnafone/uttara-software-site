import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-contact',
  imports: [FontAwesomeModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  faLinkedin = faLinkedin;
  faGithub = faGithub;

}
