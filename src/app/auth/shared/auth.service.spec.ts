import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../../../environments/environment';
import {AngularFireAuth} from '@angular/fire/auth';

describe('AuthService', () => {

  beforeEach(() => TestBed.configureTestingModule({
    imports: [AngularFireModule.initializeApp(environment.firebase)],
    providers: [
      AngularFireAuth,
      AuthService
    ]
  }));

  it('should be created', () => {
    const service: AuthService = TestBed.get(AuthService);
    expect(service).toBeTruthy();
  });

});
