import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroComponent } from './intro.component';

describe('IntroComponent', () => {
  let component: IntroComponent;
  let fixture: ComponentFixture<IntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('moves the intro arrow to founders on click and Enter, respecting reduced motion', () => {
    const founders = document.createElement('section');
    founders.id = 'founders';
    founders.scrollIntoView = jasmine.createSpy('scrollIntoView');
    document.body.appendChild(founders);
    spyOn(window, 'matchMedia').and.returnValue({ matches: true } as MediaQueryList);
    const arrow = fixture.nativeElement.querySelector('.goto') as HTMLElement;
    arrow.click();
    expect(founders.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start', inline: 'nearest' });
    const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
    arrow.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBeTrue();
    expect(founders.scrollIntoView).toHaveBeenCalledTimes(2);
    founders.remove();
  });

  it('shows its arrow only while intro intersects the viewport and cleans up listeners', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    const intro = fixture.nativeElement.querySelector('#intro') as HTMLElement;
    spyOn(intro, 'getBoundingClientRect').and.returnValues(
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
