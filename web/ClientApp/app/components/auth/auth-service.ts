import { computedFrom } from 'aurelia-framework';
import * as auth0 from 'auth0-js';

export class AuthService {
    private webAuth = new auth0.WebAuth({
        domain: 'rdnlike.eu.auth0.com',
        clientID: 'J3f4rbJSCnof95zEgI408URazlsROdf9',
        redirectUri: 'http://localhost:5000/authorize',
        audience: 'https://rdnlike.eu.auth0.com/userinfo',
        responseType: 'token id_token',
        scope: 'openid'
    });

    private isAuthenticatedInternal: boolean;
    private expirationTimer: number | undefined;

    @computedFrom('isAuthenticatedInternal')
    public get isAuthenticated() {
        return this.isAuthenticatedInternal;
    }

    constructor() {
        this.loadSession();
    }

    public login() {
        this.webAuth.authorize();
    }

    public logout() {
        this.clearSession();
    }

    public handleAuthorization() {
        return new Promise((resolve, reject) => {
            this.webAuth.parseHash((error, authResult) => {
                if (authResult
                    && authResult.accessToken
                    && authResult.idToken
                    && authResult.expiresIn) {

                    this.setSession(
                        authResult.accessToken,
                        authResult.idToken,
                        authResult.expiresIn);

                    resolve(true);
                } else if (error) {
                    console.log(error);
                }

                reject(false);
            })
        });
    }

    private setSession(accessToken: string, idToken: string, expiresIn: number) {
        const expiresAt = JSON.stringify(this.calculateExpiresAt(expiresIn));

        sessionStorage.setItem('access_token', accessToken);
        sessionStorage.setItem('id_token', idToken);
        sessionStorage.setItem('expires_at', expiresAt);

        this.isAuthenticatedInternal = true;
        this.setExpirationTimer(expiresIn);
    }

    private loadSession() {
        const accessToken = sessionStorage.getItem('access_token');
        const idToken = sessionStorage.getItem('id_token');
        const expiresAtJson = sessionStorage.getItem('expires_at');

        if (!accessToken || !idToken || !expiresAtJson) {
            this.clearSession();
            return;
        }

        const expiresAt = JSON.parse(expiresAtJson);

        this.isAuthenticatedInternal = true;
        this.setExpirationTimer(this.calculateExpiresIn(expiresAt));
    }

    private clearSession() {
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('expires_at');

        this.isAuthenticatedInternal = false;
        this.setExpirationTimer(null);
    }

    private calculateExpiresAt(expiresInSeconds: number) {
        return expiresInSeconds * 1000 + new Date().getTime();
    }

    private calculateExpiresIn(expiresAt: number) {
        return expiresAt - new Date().getTime();
    }

    private setExpirationTimer(expiresInSeconds: number | null) {
        if (this.expirationTimer) {
            clearTimeout(this.expirationTimer);
        }

        if (!expiresInSeconds) {
            return;
        }

        this.expirationTimer = setTimeout(() => this.clearSession(), expiresInSeconds * 1000);
    }

}
