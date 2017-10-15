import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { AuthService } from '../auth/auth-service';

@autoinject
export class Navmenu {

    constructor(
        private router: Router,
        private authService: AuthService) {
    }

}