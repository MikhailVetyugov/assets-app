import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useCallback, useState } from "react";

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
} from "@/app/lib/components/shadcn/ui/form"
import { Input } from "@/app/lib/components/shadcn/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/lib/components/shadcn/ui/select"
import { NumberInput } from "@/app/lib/components/number-input";
import { ASSET_TYPE_VALUES, ASSET_TYPES } from "@/app/lib/constants/asset-types";
import { saveAsset } from "@/app/lib/services/assets";
import { AssetAlreadyExistsError } from "@/app/lib/utils/errors/alreadyExists";
import { zodEmptyNumber } from "@/app/lib/utils/zodEmptyNumber";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Название актива должно быть не меньше трех символов",
  }),
  type: z.enum(ASSET_TYPE_VALUES as [string, ...string[]], {
    message: "Выберите вид актива",
  }),
  cost: zodEmptyNumber(z.number(), "Укажите стоимость актива"),
});

export type TCreateAssetFormSchema = z.infer<typeof formSchema>;

interface ICreateAssetProps {
  onAssetCreated: () => void;
}
 
export const CreateAsset: React.FC<ICreateAssetProps> = ({ onAssetCreated }) => {
  const [open, setOpen] = useState(false);

  const form = useForm<TCreateAssetFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const openDialog = useCallback(() => setOpen(true), []);

  const handleOpenChange = useCallback((open: boolean) => {
    setOpen(open);

    if (!open) {
      form.reset();
    }
  }, [form]);

  const handleSubmit = useCallback((formValues: TCreateAssetFormSchema) => {
    try {
      saveAsset(formValues);
      setOpen(false);
      onAssetCreated();
    } catch (error) {
      if (error instanceof AssetAlreadyExistsError) {
        form.setError('root', { message: error.message });
      } else {
        form.setError('root', { message: 'Неизвестная ошибка' });
      }
    }
  }, [form, onAssetCreated]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button size="lg" onClick={openDialog}>Добавить актив</Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>Добавить актив</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel htmlFor="name" className="text-right">Название актива</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Microsoft" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-start-2 col-span-3" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Вид актива</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Выберите вид актива" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {ASSET_TYPES.map(({value, name }) => <SelectItem key={value} value={value}>{name}</SelectItem>)}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="col-start-2 col-span-3" />
                  </FormItem>
                )}
              />
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
            </div>
            <DialogFooter>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
            {form.formState.errors.root && (
              <FormMessage className="col-span-4 text-right mt-4">
                {form.formState.errors.root.message}
              </FormMessage>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
