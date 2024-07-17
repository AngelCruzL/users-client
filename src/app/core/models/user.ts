export class User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;

  constructor({
    id,
    firstName,
    lastName,
    email,
    username,
    password,
  }: {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
  }) {
    if (id) this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.username = username;
    this.password = password;
  }
}
