import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  currPage = 0;
  scrollListener;

  constructor(private renderer: Renderer2) {
    const screenHeight = window.innerHeight;
    this.scrollListener = renderer.listen('window', 'scroll', e => {
      let ypos = e.target.scrollingElement.scrollTop;

      if (ypos < screenHeight)
        this.currPage = 0;
      else if (ypos >= screenHeight && ypos < (2*screenHeight))
        this.currPage = 1;
      else if (ypos >= (2 * screenHeight) && ypos < (3 * screenHeight))
        this.currPage = 2;
      else if (ypos >= (3 * screenHeight))
        this.currPage = 3;
    });
  }

  scrollToView(elem: string) {
    document.getElementById(elem)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }

}
