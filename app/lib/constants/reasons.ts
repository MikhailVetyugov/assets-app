import { TDeletionReason, TUpdateReason } from "@/app/lib/types/reasons";

export const UPDATE_REASONS: Array<{ value: TUpdateReason, name: string }> = [
  { value: 'changed', name: 'Изменилась цена актива' },
  { value: 'withdraw', name: 'Выведены денежные средства из актива' },
  { value: 'deposit', name: 'Введены денежные средства в актив' },
];

export const UPDATE_REASON_VALUES = UPDATE_REASONS.map(item => item.value);

export const DELETION_REASONS: Array<{ value: TDeletionReason, name: string }> = [
  { value: 'error', name: 'Актив добавлен по ошибке' },
  { value: 'depreciated', name: 'Актив обесценился, и его цена стала нулём' },
  { value: 'withdraw', name: 'Выведены денежные средства из актива' },
];

export const DELETION_REASON_VALUES = DELETION_REASONS.map(item => item.value);
