import { useState } from "react";

export function useTagInput() {
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (
    currentTags: string[],
    onChange: (tags: string[]) => void
  ) => {
    const newTags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0 && !currentTags.includes(tag));

    if (newTags.length > 0) {
      onChange([...currentTags, ...newTags]);
      setTagInput("");
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentTags: string[],
    onChange: (tags: string[]) => void
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag(currentTags, onChange);
    }
  };

  const handleRemoveTag = (
    index: number,
    currentTags: string[],
    onChange: (tags: string[]) => void
  ) => {
    const updatedTags = [...currentTags];
    updatedTags.splice(index, 1);
    onChange(updatedTags);
  };

  return {
    tagInput,
    setTagInput,
    handleAddTag,
    handleKeyDown,
    handleRemoveTag,
  };
}
