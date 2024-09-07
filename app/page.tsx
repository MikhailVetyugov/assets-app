'use client'

import Image from "next/image";
import { useState } from 'react';

import { capitalExists } from "./lib/data";
import { Button } from "@/components/ui/button";

export default function Home() {
  const hasCapital = capitalExists();

  const [createModalShown, setCreateModalShown] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {hasCapital ? <button onClick={() => setCreateModalShown(true)}>Please create a capital</button> : <div>Capital Details</div>}
      <div data-open={createModalShown}>Create Modal</div>
      <Button>Button</Button>
    </main>
  );
}
