export interface IManagerUsers {
  readonly id: string;
  readonly email: string;
  readonly full_name: string;
  readonly password: string;
  readonly phone: string;
  readonly created_at: any;
  readonly updated_at: any;

  readonly last_updated_at: any;
  readonly reset_token: string;
  readonly ref: any;
  // readonly portrait: string;
  // readonly isCheck_in: boolean;
  // readonly isCheck_out: boolean;
  // readonly checkinTime: any;
  // readonly checkoutTime: any;
}
