import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUtentiComponent } from './import-utenti.component';

describe('ImportUtentiComponent', () => {
  let component: ImportUtentiComponent;
  let fixture: ComponentFixture<ImportUtentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportUtentiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportUtentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
