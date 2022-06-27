import { NormalizedDropdownOption } from "@/components/dropdown/item";

export function joinDropdownChoices(options: NormalizedDropdownOption[], prompt: string): string {
  const selectedOptions = options.filter(option => Boolean(option.selected));

  if (!(selectedOptions.length > 0)) return prompt;

  return selectedOptions.map(option => option.label).join(", ");
}
