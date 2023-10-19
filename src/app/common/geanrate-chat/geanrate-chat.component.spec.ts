import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeanrateChatComponent } from './geanrate-chat.component';

describe('GeanrateChatComponent', () => {
  let component: GeanrateChatComponent;
  let fixture: ComponentFixture<GeanrateChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeanrateChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeanrateChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
