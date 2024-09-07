import { TDeletionReason } from "@/app/lib/types/reasons";

export const DELETION_REASONS: Array<{ value: TDeletionReason, name: string }> = [
  { value: 'error', name: 'Актив добавлен по ошибке' },
  { value: 'depreciated', name: 'Актив обесценился, и его цена стала нулём' },
  { value: 'withdrawn', name: 'Выведены денежные средства из актива' },
];

export const DELETION_REASON_VALUES = DELETION_REASONS.map(item => item.value);
