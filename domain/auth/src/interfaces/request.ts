export interface registerRequest {
  user: string;
  password: string;
  email: string | null;
}

export interface loginRequest {
  user: string;
  password: string;
}
