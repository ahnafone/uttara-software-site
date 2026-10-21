import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoundersComponent } from './founders.component';

describe('FoundersComponent', () => {
  let component: FoundersComponent;
  let fixture: ComponentFixture<FoundersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FoundersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoundersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('moves the founders arrow to websites on click and Space, respecting reduced motion', () => {
    const projects = document.createElement('section');
    projects.id = 'projects';
    projects.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(projects);
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const arrow = fixture.nativeElement.querySelector('.goto') as HTMLElement;
    arrow.click();
    expect(projects.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start', inline: 'nearest' });
    const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
    arrow.dispatchEvent(space);
    expect(space.defaultPrevented).toBeTrue();
    expect(projects.scrollIntoView).toHaveBeenCalledTimes(2);
    projects.remove();
  });

  it('shows its arrow only while founders intersects the viewport and cleans up listeners', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    const founders = fixture.nativeElement.querySelector('#founders') as HTMLElement;
    spyOn(founders, 'getBoundingClientRect').and.returnValues(
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
});
