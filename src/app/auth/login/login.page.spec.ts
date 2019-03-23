import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPage,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        AngularFireModule.initializeApp(environment.firebase)
      ],
      providers: [
        AngularFireAuth,
        AuthService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with empty fields', function () {
    expect(component.email.value).toBe('');
    expect(component.password.value).toBe('');
  });

  it('should render form invalid with no data', function () {
    expect(component.myForm.invalid).toBeTruthy();
  });

  it('should have email required', function () {
    component.email.setValue('');
    const errors = component.email.errors || {};

    expect(errors['required']).toBeTruthy();
  });

  it('should have password required', function () {
    component.password.setValue('');
    const errors = component.password.errors || {};

    expect(errors['required']).toBeTruthy();
  });

  it('should render form valid with valid data', function () {
    expect(component.myForm.valid).toBeFalsy();
    component.myForm.controls['email'].setValue('test@test.com');
    component.myForm.controls['password'].setValue('123456789');
    expect(component.myForm.valid).toBeTruthy();
  });
});
