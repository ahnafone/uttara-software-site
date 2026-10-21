import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    ['founders', 'projects', 'products', 'contact'].forEach(id => document.getElementById(id)?.remove());
    delete (document.documentElement as any).scrollHeight;
    delete (window as any).scrollY;
    delete (window as any).innerHeight;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('provides the four short section links in the approved order', () => {
    const links = Array.from(fixture.nativeElement.querySelectorAll('nav a')) as HTMLAnchorElement[];
    expect(links.map(link => link.textContent?.trim())).toEqual(['founders', 'websites', 'products', 'contact']);
    expect(links.map(link => link.getAttribute('href'))).toEqual([
      '#founders', '#projects', '#products', '#contact'
    ]);
    expect(fixture.nativeElement.querySelector('a[href="/timesheet/"]')).toBeNull();
  });

  it('does not mark contact active on the initial intro before tracked sections', () => {
    const contact = document.createElement('section');
    contact.id = 'contact';
    document.body.appendChild(contact);
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 5000 });
    spyOn(contact, 'getBoundingClientRect').and.returnValue({
      top: 4000, bottom: 4500, left: 0, right: 0, width: 0, height: 500, x: 0, y: 4000, toJSON: () => ({})
    } as DOMRect);
    (component as any).updateActiveSection();
    expect(component.activeSection).toBeNull();
    contact.remove();
  });

  it('smooth-scrolls for an unmodified primary click and leaves modified clicks native', () => {
    const founders = document.createElement('section');
    founders.id = 'founders';
    founders.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(founders);
    const pushState = spyOn(history, 'pushState');
    const link = fixture.nativeElement.querySelector('a[href="#founders"]') as HTMLAnchorElement;

    const normalClick = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    link.dispatchEvent(normalClick);
    expect(normalClick.defaultPrevented).toBeTrue();
    expect(pushState).toHaveBeenCalledWith(null, '', '#founders');
    expect(founders.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });

    const modifiedClick = new MouseEvent('click', {
      bubbles: true, cancelable: true, button: 0, ctrlKey: true
    });
    link.dispatchEvent(modifiedClick);
    expect(modifiedClick.defaultPrevented).toBeFalse();
    expect(pushState).toHaveBeenCalledTimes(1);
    document.body.removeChild(founders);
  });

  it('does not intercept a click if the fragment target is missing', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    component.navigateToSection(event, 'missing-section');
    expect(event.defaultPrevented).toBeFalse();
  });

  it('respects reduced-motion preference when scrolling to a section', () => {
    const products = document.createElement('section');
    products.id = 'products';
    products.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(products);
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    (fixture.nativeElement.querySelector('a[href="#products"]') as HTMLAnchorElement).click();
    expect(products.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
    document.body.removeChild(products);
  });

  it('selects active sections from their actual positions, including contact at document end', () => {
    const sections = ['founders', 'projects', 'products', 'contact'].map((id, index) => {
      const section = document.createElement('section');
      section.id = id;
      spyOn(section, 'getBoundingClientRect').and.callFake(() => ({
        top: [1000, 2000, 3000, 4000][index] - window.scrollY, bottom: 0, left: 0, right: 0,
        width: 0, height: 0, x: 0, y: 0, toJSON: () => ({})
      } as DOMRect));
      document.body.appendChild(section);
      return section;
    });
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 5000 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 1000 });

    (component as any).updateActiveSection();
    expect(component.activeSection).toBeNull(); // The intro precedes the first tracked section.
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 800 });
    (component as any).updateActiveSection();
    expect(component.activeSection).toBe('founders');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 1800 });
    (component as any).updateActiveSection();
    expect(component.activeSection).toBe('projects');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 4000 });
    (component as any).updateActiveSection();
    expect(component.activeSection).toBe('contact');
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 0 });
    sections.forEach(section => document.body.removeChild(section));
  });

  it('removes scroll and resize listeners on destroy', () => {
    // Listener disposers are retained by the component; verify their contract directly.
    const disposers = component as any;
    const scrollDisposer = spyOn(disposers, 'removeScrollListener').and.callThrough();
    const resizeDisposer = spyOn(disposers, 'removeResizeListener').and.callThrough();
    fixture.destroy();
    expect(scrollDisposer).toHaveBeenCalled();
    expect(resizeDisposer).toHaveBeenCalled();
  });
});
