import { computed, EventEmitter, Injectable } from '@angular/core';
import { User } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  #idUser = new EventEmitter<number>();
  $idUser = computed(() => this.#idUser);
  #user = new EventEmitter<User>();
  $user = computed(() => this.#user);
  #newUser = new EventEmitter<User>();
  $newUser = computed(() => this.#newUser);

  constructor() {}
}
