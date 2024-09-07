import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCallback, useState } from "react";
import { TrashIcon } from '@heroicons/react/24/solid'

import { useToast } from "@/app/lib/hooks/shadcn/use-toast"
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
import { deleteAsset } from "@/app/lib/services/assets";
import { DELETION_REASON_VALUES, DELETION_REASONS } from "@/app/lib/constants/reasons";
import { IAsset } from "../types/assets";

const formSchema = z.object({
  reason: z.enum(DELETION_REASON_VALUES as [string, ...string[]], {
    message: "Выберите причину удаления",
  }),
});

export type TDeleteAssetFormSchema = z.infer<typeof formSchema>;

interface IDeleteAssetProps {
  asset: IAsset;
  onAssetDeleted: () => void;
}
 
export const DeleteAsset: React.FC<IDeleteAssetProps> = ({ asset, onAssetDeleted }) => {
  const [open, setOpen] = useState(false);

  const { toast } = useToast()

  const form = useForm<TDeleteAssetFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: DELETION_REASONS[0].value,
    },
  });

  const openDialog = useCallback(() => setOpen(true), []);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      form.reset();
    }
  }, [form]);

  const handleSubmit = useCallback((formValues: TDeleteAssetFormSchema) => {
    deleteAsset(asset, formValues);
    setOpen(false);
    onAssetDeleted();

    if (formValues.reason !== 'error') {
      toast({
        title: "Актив останется в списке",
        description: "Актив обнулён, но продолжает оставаться в списке активов для расчёта доходности",
      });
    }
  }, [form, toast, onAssetDeleted]);

  console.log(form)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <TrashIcon className="w-5 cursor-pointer text-slate-400 hover:text-slate-600" onClick={openDialog} />
      <DialogContent className="sm:max-w-[625px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Удалить актив</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-8">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Причина удаления</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Выберите причину удаления" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {DELETION_REASONS.map(({value, name }) => <SelectItem key={value} value={value}>{name}</SelectItem>)}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="col-start-2 col-span-3">
                      Причина нужна для корректного расчёта среднегодовой доходности.
                    </FormDescription>
                    <FormMessage className="col-start-2 col-span-3" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Подтвердить</Button>
            </DialogFooter>
            {form.getValues().reason !== 'error' && (
              <FormMessage className="col-span-4 text-right mt-4 text-neutral-950	">
                Актив будет обнулён, но не удалён.
              </FormMessage>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
