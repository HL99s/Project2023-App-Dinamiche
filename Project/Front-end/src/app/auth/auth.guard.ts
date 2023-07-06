import {Router} from '@angular/router';
import {inject} from '@angular/core';

export const AuthGuard = () => {

  const router = inject(Router);

  if (localStorage.getItem("TOKEN")) {
    return true;
  }
  // Redirect to the login page

  return router.parseUrl('/login');
};
