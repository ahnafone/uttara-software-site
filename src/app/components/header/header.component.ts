import { afterNextRender, ChangeDetectorRef, Component, OnDestroy, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnDestroy {

  activeSection: string | null = null;
  private removeScrollListener: () => void;
  private removeResizeListener: () => void;

  constructor(private renderer: Renderer2, private changeDetectorRef: ChangeDetectorRef) {
    this.removeScrollListener = renderer.listen('window', 'scroll', () => this.updateActiveSection());
    this.removeResizeListener = renderer.listen('window', 'resize', () => this.updateActiveSection());
    afterNextRender(() => {
      this.updateActiveSection();
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this.removeScrollListener();
    this.removeResizeListener();
  }

  navigateToSection(event: MouseEvent, section: string): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const target = document.getElementById(section);
    if (!target) return;

    event.preventDefault();
    history.pushState(null, '', `#${section}`);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
  }

  private updateActiveSection(): void {
    const sections = ['founders', 'projects', 'products', 'contact'];
    const scrollPosition = window.scrollY + window.innerHeight * 0.3;
    const documentBottom = document.documentElement.scrollHeight - window.innerHeight;

    if (document.getElementById('contact') && window.scrollY >= documentBottom - 1) {
      this.activeSection = 'contact';
      return;
    }

    this.activeSection = null;
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element && element.getBoundingClientRect().top + window.scrollY <= scrollPosition) {
        this.activeSection = section;
      }
    }
  }

}
