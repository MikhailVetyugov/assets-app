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
import { TAssetType } from "@/app/lib/types/assets";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Название актива должно быть не меньше трех символов",
  }),
  type: z.enum(ASSET_TYPE_VALUES as [string, ...string[]], {
    message: "Выберите вид актива",
  }),
  cost: z.coerce.number({
    message: "Укажите стоимость актива",
  }),
});

interface ICreateAssetProps {
  onAssetCreated: () => void;
}
 
export const CreateAsset: React.FC<ICreateAssetProps> = ({ onAssetCreated }) => {
  const [open, setOpen] = useState(false);

  const toggleDialogVisibility = useCallback((open: boolean) => setOpen(open), [])
  const openDialog = useCallback(() => setOpen(true), [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  });

  const handleSubmit = useCallback((form: z.infer<typeof formSchema>) => {
    saveAsset({
      ...form,
      type: form.type as TAssetType,
    });

    setOpen(false);
    onAssetCreated();
  }, [onAssetCreated]);

  return (
    <Dialog open={open} onOpenChange={toggleDialogVisibility}>
      <Button size="lg" onClick={openDialog}>Создать активы</Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <DialogHeader>
              <DialogTitle>Создать актив</DialogTitle>
            </DialogHeader>
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
                  <FormMessage className="col-span-4 col-start-2 col-span-3" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
