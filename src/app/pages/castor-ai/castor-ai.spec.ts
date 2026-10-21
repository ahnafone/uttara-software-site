import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastorAi } from './castor-ai';

describe('CastorAi', () => {
  let component: CastorAi;
  let fixture: ComponentFixture<CastorAi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastorAi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastorAi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
