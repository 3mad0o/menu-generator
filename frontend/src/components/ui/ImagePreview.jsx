import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const ImagePreview = ({ title, onRemove }) => {
  const { watch } = useFormContext();
  const imageUrl = watch("store_logo");

  return (
    <Card className="relative mx-auto w-full overflow-hidden py-0">
      <img
        src={imageUrl}
        alt={title || "Preview"}
        className="h-56 w-full object-cover"
      />

      <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition hover:opacity-100">
        <Button
          onClick={onRemove}
          type="button"
          variant="destructive"
        >
          Remove
        </Button>
      </div>

      {title && (
        <CardContent className="p-4">
          <h4 className="truncate text-lg font-semibold">
            {title}
          </h4>
        </CardContent>
      )}
    </Card>
  );
};
