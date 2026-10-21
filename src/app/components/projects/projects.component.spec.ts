import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsComponent } from './projects.component';

describe('ProjectsComponent', () => {
  let component: ProjectsComponent;
  let fixture: ComponentFixture<ProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders three keyboard-accessible clickable cards with their approved destinations', () => {
    const cards = Array.from(fixture.nativeElement.querySelectorAll('.project')) as HTMLElement[];
    expect(cards.map(card => card.querySelector('h3')?.textContent?.trim())).toEqual([
      'Recyclorobo.ai', 'Sarcomere Dynamics', 'Platypus Toys'
    ]);
    expect(component.projects.map(project => project.link)).toEqual([
      'https://recyclorobo.ai', 'https://sarcomeredynamics.com', 'https://platypustoys.com'
    ]);
    expect(cards.every(card => card.getAttribute('role') === 'link' && card.tabIndex === 0)).toBeTrue();
    expect(fixture.nativeElement.querySelector('a[href*="timesheet"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('#projects')).toBeTruthy();
  });

  it('opens external cards safely on primary click, Enter, and middle click', () => {
    const open = spyOn(window, 'open');
    const firstCard = fixture.nativeElement.querySelector('.project') as HTMLElement;
    firstCard.click();
    expect(open).toHaveBeenCalledWith('https://recyclorobo.ai', '_blank', 'noopener,noreferrer');
    component.handleProjectKeydown(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }), component.projects[1].link, true);
    expect(open).toHaveBeenCalledWith('https://sarcomeredynamics.com', '_blank', 'noopener,noreferrer');
    const middleClick = new MouseEvent('auxclick', { button: 1, cancelable: true });
    component.openProjectFromAuxClick(middleClick, component.projects[2].link, true);
    expect(middleClick.defaultPrevented).toBeTrue();
    expect(open).toHaveBeenCalledWith('https://platypustoys.com', '_blank', 'noopener,noreferrer');
    component.openProject(new MouseEvent('click', { button: 0, ctrlKey: true }), component.projects[0].link, true);
    expect(open).toHaveBeenCalledWith('https://recyclorobo.ai', '_blank', 'noopener,noreferrer');
    expect(open).toHaveBeenCalledTimes(4);
  });

  it('does not navigate for non-primary card clicks', () => {
    const open = spyOn(window, 'open');
    component.openProject(new MouseEvent('click', { button: 1 }), component.projects[0].link, true);
    expect(open).not.toHaveBeenCalled();
  });

  it('moves the section arrow to products and supports Enter/Space and reduced motion', () => {
    const products = document.createElement('section');
    products.id = 'products';
    products.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(products);
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const arrow = fixture.nativeElement.querySelector('.goto') as HTMLElement;
    arrow.click();
    expect(products.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start', inline: 'nearest' });
    const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    arrow.dispatchEvent(space);
    expect(space.defaultPrevented).toBeTrue();
    expect(products.scrollIntoView).toHaveBeenCalledTimes(2);
    products.remove();
  });

  it('shows its arrow only while projects intersects the viewport and cleans up listeners', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    const projects = fixture.nativeElement.querySelector('#projects') as HTMLElement;
    spyOn(projects, 'getBoundingClientRect').and.returnValues(
      { top: 100, bottom: 900 } as DOMRect,
      { top: 900, bottom: 1000 } as DOMRect
    );
    (component as any).updateArrowVisibility();
    expect(component.showArrow).toBeTrue();
    (component as any).updateArrowVisibility();
    expect(component.showArrow).toBeFalse();
    const scrollDisposer = spyOn(component as any, 'removeScrollListener').and.callThrough();
    const resizeDisposer = spyOn(component as any, 'removeResizeListener').and.callThrough();
    fixture.destroy();
    expect(scrollDisposer).toHaveBeenCalled();
    expect(resizeDisposer).toHaveBeenCalled();
  });

  it('renders the exact client section supporting copy', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'websites we’ve designed, developed, and delivered for our clients.'
    );
  });
});
