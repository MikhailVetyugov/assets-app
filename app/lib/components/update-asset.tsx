import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCallback, useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

import { Button } from "@/app/lib/components/shadcn/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/lib/components/shadcn/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/app/lib/components/shadcn/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/components/shadcn/ui/select"
import { NumberInput } from "@/app/lib/components/number-input";
import { zodEmptyNumber } from "@/app/lib/utils/zodEmptyNumber";
import { IAsset } from "@/app/lib/types/assets";
import { getLastAssetCost, getUpdateReasons } from "@/app/lib/utils/forms";
import { UPDATE_REASON_VALUES, UPDATE_REASONS } from "../constants/reasons";
import { updateAsset } from "../services/assets";

const formSchema = z.object({
  cost: zodEmptyNumber(z.number(), "Укажите новую стоимость актива"),
  reason: z.enum(UPDATE_REASON_VALUES as [string, ...string[]], {
    message: "Выберите причину обновления",
  }),
});

export type TUpdateAssetFormSchema = z.infer<typeof formSchema>;

interface IUpdateAssetProps {
  asset: IAsset;
  onAssetUpdated: () => void;
}
 
export const UpdateAsset: React.FC<IUpdateAssetProps> = ({ asset, onAssetUpdated }) => {
  const [open, setOpen] = useState(false);
  
  const oldCost = getLastAssetCost(asset);
  const defaultReason = UPDATE_REASONS[0].value;

  const form = useForm<TUpdateAssetFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cost: oldCost,
      reason: defaultReason,
    },
  });

  const openDialog = useCallback(() => setOpen(true), []);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      form.reset();
    }
  }, [form]);

  const handleSubmit = useCallback((formValues: TUpdateAssetFormSchema) => {
    updateAsset(asset, formValues);
    setOpen(false);
    onAssetUpdated();
  }, [asset, onAssetUpdated]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <PencilSquareIcon className="w-5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={openDialog} />
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Обновить актив</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-8">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel htmlFor="cost" className="text-right">Стоимость</FormLabel>
                    <FormControl>
                      <NumberInput
                        id="cost"
                        placeholder="50 000"
                        className="col-span-3"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="col-start-2 col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => { // TODO: Вынести в отдельный компонент.
                  const newCost = form.watch('cost');
                  const reasons = getUpdateReasons(oldCost, newCost);

                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  useEffect(() => {
                    const hasSelectedReason = reasons.some(item => item.value === field.value);

                    if (!hasSelectedReason) {
                      form.setValue('reason', defaultReason);
                    }
                  }, [form, reasons, defaultReason]);

                  return (
                    <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                      <FormLabel className="text-right">Причина обновления</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Выберите причину обновления" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {reasons.map(({value, name }) => <SelectItem key={value} value={value}>{name}</SelectItem>)}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription className="col-start-2 col-span-3">
                        Причина нужна для корректного расчёта среднегодовой доходности.
                      </FormDescription>
                      <FormMessage className="col-start-2 col-span-3" />
                    </FormItem>
                  )
                }}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Обновить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
