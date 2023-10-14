export interface IOrganizerUsers {
  readonly id: string;
  readonly email: string;
  readonly password: string;
  readonly full_name: string;
  readonly phone: string;
  readonly ref: string;
  readonly created_at: string;
  readonly last_updated_at: string;
  readonly reset_token: string;
}
