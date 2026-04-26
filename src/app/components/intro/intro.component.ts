import { Component, Renderer2 } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-intro',
  imports: [FontAwesomeModule],
  templateUrl: './intro.component.html',
  styleUrl: './intro.component.css'
})
export class IntroComponent {

  faArrowDown = faChevronDown;

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

      if (!this.hideArrow && ypos > (0.6 * screenHeight)) {
        this.hideArrow = true
      } else if (this.hideArrow && ypos < (0.6 * screenHeight)) {
        this.hideArrow = false;
      }
    });
  }

  scrollToView() {
    document.getElementById("founders")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
    this.showArrow = false;
  }

}
