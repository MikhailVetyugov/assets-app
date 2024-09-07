import * as React from "react"
import { ChangeEventHandler, useEffect, useCallback, useState } from "react";

import { Input, InputProps } from "@/app/lib/components/shadcn/ui/input"

type TNumberInputProps = Omit<InputProps, 'type' | 'inputMode' | 'value'> & {
  value?: number;
};

const formatter = new Intl.NumberFormat("ru");

export const NumberInput = React.forwardRef<HTMLInputElement, TNumberInputProps>(({ value, onChange, ...rest }, ref) => {
  const [rawValue, setRawValue] = useState('');
  
  useEffect(() => {
    const newRawValue = (value || value === 0) ? formatter.format(value) : '';

    if (rawValue !== newRawValue) {
      setRawValue(newRawValue);
    }
  }, [rawValue, value]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(event => {
    const value = parseFloat(event.target.value.replace(/[^\d]/g, ''));

    if (isNaN(value)) {
      setRawValue('');
      event.target.value = '';
    } else {
      setRawValue(formatter.format(value));
      event.target.value = String(value);
    }

    if (onChange) {
      onChange(event);
    }
  }, [onChange]);

  return (
    <Input
      {...rest}
      value={rawValue}
      type="text"
      inputMode="decimal"
      ref={ref}
      onChange={handleChange}
    />
  )
});

NumberInput.displayName = 'NumberInput';
