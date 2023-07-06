import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userId: string = "";

  _isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  constructor(private router: Router) {
  }

  saveUserData(id: number, token: string, username: string) {

    localStorage.setItem("ID", String(id));
    localStorage.setItem("TOKEN", token);
    localStorage.setItem("USERNAME", username)
    this.setUserId(String(id));
  }

  setUserId(id: string) {
    this.userId = id;

    this._isAuthenticated.next(true);
  }

  logOut() {
    localStorage.removeItem("ID");
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("USERNAME");
    this.userId = "";
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  autoLogin() {
    const id = localStorage.getItem("ID");
    if (id) {
      this.setUserId(id);
    }
  }
}
