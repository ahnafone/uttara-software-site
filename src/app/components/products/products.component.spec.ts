import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { ProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let fixture: ComponentFixture<ProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    fixture.detectChanges();
  });

  it('separates Castor AI router navigation from the full-document timesheet destination', () => {
    const root: HTMLElement = fixture.nativeElement;
    const cards = Array.from(root.querySelectorAll('.product')) as HTMLElement[];
    const castor = cards[0];
    const timesheet = cards[1];

    expect(root.querySelector('#products')).toBeTruthy();
    expect(castor.textContent).toContain('Castor AI');
    expect(cards.length).toBe(2);
    expect(castor.getAttribute('role')).toBe('link');
    expect(castor.tabIndex).toBe(0);
    expect(timesheet.getAttribute('role')).toBe('link');
    expect(timesheet.tabIndex).toBe(0);
    expect(timesheet.textContent).toContain('timesheet.');
    expect((timesheet.querySelector('img') as HTMLImageElement).getAttribute('src')).toBe('projects/timesheet.png');
    expect(castor.querySelector('.castor-art')).toBeTruthy();
  });

  it('uses Angular router navigation for Castor click and Enter', () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    const cards = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('.product')) as HTMLElement[];
    cards[0].click();
    expect(navigate).toHaveBeenCalledWith('/castor');
    fixture.componentInstance.handleProductKeydown(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }), 'castor');
    expect(navigate).toHaveBeenCalledTimes(2);
    expect(cards[1].querySelector('img')?.getAttribute('src')).toBe('projects/timesheet.png');
  });

  it('resets scroll only after successful Castor router navigation', async () => {
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigateByUrl').and.resolveTo(true);
    const scrollTo = spyOn(window, 'scrollTo');
    const open = spyOn(window, 'open');
    const component = fixture.componentInstance;

    component.openProduct(new MouseEvent('click', { button: 0 }), 'castor');
    await Promise.resolve();
    expect(navigate).toHaveBeenCalledWith('/castor');
    expect(scrollTo).toHaveBeenCalledWith(0, 0);

    navigate.calls.reset();
    scrollTo.calls.reset();
    navigate.and.resolveTo(false);
    component.handleProductKeydown(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }), 'castor');
    await Promise.resolve();
    expect(navigate).toHaveBeenCalledWith('/castor');
    expect(scrollTo).not.toHaveBeenCalled();

    navigate.calls.reset();
    scrollTo.calls.reset();
    component.openProduct(new MouseEvent('click', { button: 0, ctrlKey: true }), 'castor');
    component.openProduct(new MouseEvent('click', { button: 0, metaKey: true }), 'castor');
    await Promise.resolve();
    expect(navigate).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(open).toHaveBeenCalledWith('/castor', '_blank', 'noopener,noreferrer');
    expect(open).toHaveBeenCalledTimes(2);
  });

  it('opens modified and middle-click product cards in a safe new tab', () => {
    const open = spyOn(window, 'open');
    fixture.componentInstance.openProduct(new MouseEvent('click', { button: 0, ctrlKey: true }), 'castor');
    fixture.componentInstance.openProduct(new MouseEvent('click', { button: 0, metaKey: true }), 'timesheet');
    const middleClick = new MouseEvent('auxclick', { button: 1, cancelable: true });
    fixture.componentInstance.openProductFromAuxClick(middleClick, 'timesheet');
    expect(middleClick.defaultPrevented).toBeTrue();
    expect(open).toHaveBeenCalledWith('/castor', '_blank', 'noopener,noreferrer');
    expect(open).toHaveBeenCalledWith('/timesheet/', '_blank', 'noopener,noreferrer');
    expect(open).toHaveBeenCalledTimes(3);
  });

  it('moves the section arrow to contact and supports Enter/Space with reduced motion', () => {
    const contact = document.createElement('section');
    contact.id = 'contact';
    contact.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(contact);
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const arrow = (fixture.nativeElement as HTMLElement).querySelector('.goto') as HTMLElement;
    arrow.click();
    expect(contact.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start', inline: 'nearest' });
    const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    arrow.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBeTrue();
    expect(contact.scrollIntoView).toHaveBeenCalledTimes(2);
    contact.remove();
  });

  it('shows its arrow only while products intersects the viewport and cleans up listeners', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    const products = (fixture.nativeElement as HTMLElement).querySelector('#products') as HTMLElement;
    spyOn(products, 'getBoundingClientRect').and.returnValues(
      { top: 100, bottom: 900 } as DOMRect,
      { top: 900, bottom: 1000 } as DOMRect
    );
    (fixture.componentInstance as any).updateArrowVisibility();
    expect(fixture.componentInstance.showArrow).toBeTrue();
    (fixture.componentInstance as any).updateArrowVisibility();
    expect(fixture.componentInstance.showArrow).toBeFalse();
    const scrollDisposer = spyOn(fixture.componentInstance as any, 'removeScrollListener').and.callThrough();
    const resizeDisposer = spyOn(fixture.componentInstance as any, 'removeResizeListener').and.callThrough();
    fixture.destroy();
    expect(scrollDisposer).toHaveBeenCalled();
    expect(resizeDisposer).toHaveBeenCalled();
  });

  it('renders the exact products supporting copy', () => {
    expect((fixture.nativeElement as HTMLElement).textContent).toContain(
      'apps built and maintained by uttara software for everyday utility and ongoing services.'
    );
  });
});
