import { Button } from "@nextui-org/react";
export default function Home() {
  return (
    <div>
      <h1 className="text-4xl text-center">Code Haven Staging</h1>
      <div className="flex gap-4">
        <Button color="primary" variant="solid">
          Solid
        </Button>

        <Button color="primary" variant="ghost">
          Ghost
        </Button>
      </div>
    </div>
  );
}
