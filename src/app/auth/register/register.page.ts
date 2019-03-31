import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from '../shared/password.validator';
import { AuthService } from '../shared/auth.service';
import { NavController } from '@ionic/angular';
import { ModuleRoutes } from '../../ModuleRoutes';

@Component({
  selector: 'a-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private navCtrl: NavController) {
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: ['', [
        Validators.required,
        Validators.minLength(4)
      ]],
      repeatPassword: ['', [
        Validators.required,
        PasswordValidator.passwordsMustMatch()]]
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('repeatPassword');
  }

  register() {
    // Ensure no space at end!
    const email = this.email.value.trim();
    const password = this.password.value;
    // Handle registration
    this.authService.registerWithEmailAndPassword(email, password)
      .then(() => {
        this.navCtrl.navigateRoot(ModuleRoutes.LOGIN);
      })
      .catch(err => {
        // TODO Handle error and add popup!
        // this.showPopup('Error', err.message);
      });
  }
}
