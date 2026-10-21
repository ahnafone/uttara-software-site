import { afterNextRender, ChangeDetectorRef, Component, OnDestroy, Renderer2 } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  imports: [FontAwesomeModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnDestroy {
  showArrow = false;
  faArrowDown = faChevronDown;
  private removeScrollListener: () => void;
  private removeResizeListener: () => void;

  constructor(private renderer: Renderer2, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
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

  openProduct(event: MouseEvent, product: 'castor' | 'timesheet'): void {
    if (event.button !== 0) return;
    const destination = product === 'castor' ? '/castor' : '/timesheet/';

    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      window.open(destination, '_blank', 'noopener,noreferrer');
    } else if (product === 'castor') {
      this.navigateToCastor(destination);
    } else {
      window.location.assign(destination);
    }
  }

  openProductFromAuxClick(event: MouseEvent, product: 'castor' | 'timesheet'): void {
    if (event.button === 1) {
      event.preventDefault();
      const destination = product === 'castor' ? '/castor' : '/timesheet/';
      window.open(destination, '_blank', 'noopener,noreferrer');
    }
  }

  handleProductKeydown(event: KeyboardEvent, product: 'castor' | 'timesheet'): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      const destination = product === 'castor' ? '/castor' : '/timesheet/';
      if (product === 'castor') {
        this.navigateToCastor(destination);
      } else {
        window.location.assign(destination);
      }
    }
  }

  private navigateToCastor(destination: string): void {
    void this.router.navigateByUrl(destination).then(navigated => {
      if (navigated) window.scrollTo(0, 0);
    });
  }

  scrollToView(): void {
    document.getElementById('contact')?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  handleArrowKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.scrollToView();
    }
  }

  private updateArrowVisibility(): void {
    const section = document.getElementById('products');
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    this.showArrow = bounds.top < window.innerHeight && bounds.bottom > 0;
  }
}
