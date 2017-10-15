import { autoinject } from 'aurelia-framework';
import { RoutableComponentActivate, Router } from "aurelia-router";
import { AuthService } from './auth-service';

@autoinject
export class Authorize implements RoutableComponentActivate {

    constructor(
        private router: Router,
        private authService: AuthService) {
    }

    public async activate() {
        const isAuthenticated = await this.authService.handleAuthorization();

        if (isAuthenticated) {
            console.log('Authentication successful, redirecting...');
            this.router.navigateToRoute('home');
        }
    }

}
