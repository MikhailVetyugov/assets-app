export type TCreationReason =
  | 'created';

export type TUpdateReason =
  | 'changed'
  | 'withdraw'
  | 'deposit';

export type TDeletionReason =
  | 'depreciated'
  | 'withdraw'
  | 'error';
