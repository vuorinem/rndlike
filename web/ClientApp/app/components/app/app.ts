import { Aurelia, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration, ConfiguresRouter } from 'aurelia-router';

export class App implements ConfiguresRouter {
    router: Router;

    configureRouter(config: RouterConfiguration, router: Router) {
        config.title = 'Aurelia';
        config.options.pushState = true;
        config.map([{
            route: ['', 'home'],
            name: 'home',
            settings: { icon: 'home' },
            moduleId: PLATFORM.moduleName('../home/home'),
            nav: true,
            title: 'Home'
        }, {
            route: ['authorize'],
            name: 'authorize',
            moduleId: PLATFORM.moduleName('../auth/authorize'),
            nav: false,
        }]);

        this.router = router;
    }
}
