import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { Home } from './home';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    if (!fixture.nativeElement.isConnected) document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    fixture.nativeElement.remove();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('composes the sections in founders, client websites, products, contact order', () => {
    const selectorOrder = Array.from(fixture.nativeElement.children as HTMLCollection)
      .map(element => element.tagName.toLowerCase());
    expect(selectorOrder).toEqual([
      'app-header', 'app-intro', 'app-founders', 'app-projects', 'app-products', 'app-contact'
    ]);
  });

  it('settles attached initial header and intro state without a dev-mode expression change', async () => {
    expect(fixture.nativeElement.isConnected).toBeTrue();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    fixture.checkNoChanges();

    const header = fixture.debugElement.query(By.css('app-header')).componentInstance;
    const intro = fixture.debugElement.query(By.css('app-intro')).componentInstance;
    expect(header.activeSection).toBeNull();
    expect(fixture.nativeElement.querySelector('app-header .header-border')).toBeNull();
    const introRoot = fixture.nativeElement.querySelector('#intro') as HTMLElement;
    const viewportState = JSON.stringify({
      showArrow: intro.showArrow,
      connected: introRoot.isConnected,
      bounds: introRoot.getBoundingClientRect().toJSON(),
      innerHeight: window.innerHeight,
      scrollY: window.scrollY
    });
    expect(intro.showArrow).withContext(viewportState).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-intro .goto.show-arrow')).withContext(viewportState).toBeTruthy();
  });
});
