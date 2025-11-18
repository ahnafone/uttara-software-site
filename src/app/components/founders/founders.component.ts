import { Component, OnDestroy, Renderer2 } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-founders',
  imports: [FontAwesomeModule],
  templateUrl: './founders.component.html',
  styleUrl: './founders.component.css'
})
export class FoundersComponent implements OnDestroy {

  faArrowDown = faChevronDown;
  faMail = faAt;
  faLinkedIn = faLinkedin;

  showArrow = false;
  hideArrow = false;
  scrollListener;

  constructor(private renderer: Renderer2) {
    setTimeout(() => {
      this.showArrow = true;
    }, 3000);

    const screenHeight = screen.height;
    this.scrollListener = renderer.listen('window', 'scroll', e => {
      let ypos = e.target.scrollingElement.scrollTop;

      if(!this.hideArrow && ypos > (0.6*screenHeight)) {
        this.hideArrow = true
      } else if (this.hideArrow && ypos < (0.6 * screenHeight)) {
        this.hideArrow = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.scrollListener();
  }


  scrollToView() {
    document.getElementById("people")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    this.showArrow = false;
  }

}
