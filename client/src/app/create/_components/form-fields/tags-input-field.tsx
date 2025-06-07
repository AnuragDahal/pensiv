import React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTagInput } from "../hooks/use-tag-input";

interface TagsInputFieldProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInputField({ value, onChange }: TagsInputFieldProps) {
  const {
    tagInput,
    setTagInput,
    handleAddTag,
    handleKeyDown,
    handleRemoveTag,
  } = useTagInput();

  return (
    <FormItem>
      <FormLabel>Tags (comma or Enter to add)</FormLabel>
      <FormControl>
        <>
          <Input
            placeholder="Enter a tag and press Enter or comma"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, value, onChange)}
            onBlur={() => handleAddTag(value, onChange)}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-muted text-sm rounded-full px-3 py-1"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index, value, onChange)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
