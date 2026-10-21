import { afterNextRender, ChangeDetectorRef, Component, OnDestroy, Renderer2 } from '@angular/core';
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
  private removeScrollListener: () => void;
  private removeResizeListener: () => void;

  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
    this.removeScrollListener = renderer.listen('window', 'scroll', () => this.updateArrowVisibility());
    this.removeResizeListener = renderer.listen('window', 'resize', () => this.updateArrowVisibility());
    afterNextRender(() => {
      this.updateArrowVisibility();
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
    this.removeResizeListener();
  }


  scrollToView(): void {
    document.getElementById("projects")?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: "start",
      inline: "nearest"
    });
  }

  handleArrowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.scrollToView();
    }
  }

  private updateArrowVisibility(): void {
    const section = document.getElementById('founders');
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    this.showArrow = bounds.top < window.innerHeight && bounds.bottom > 0;
  }

}
