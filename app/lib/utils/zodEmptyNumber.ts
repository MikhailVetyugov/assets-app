import { z, ZodNumber } from 'zod';

export const zodEmptyNumber = (zodPipe: ZodNumber, message: string) => {
  return (
    z.any({
      message,
    })
    .refine(value => value !== '' && !isNaN(Number(value)), {
      message,
    })
    .transform(value => parseFloat(value as string))
    .pipe(zodPipe)
  );
};
