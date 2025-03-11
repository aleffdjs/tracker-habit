
import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { HabitCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategorySelectorProps {
  category: HabitCategory;
  setCategory: (category: HabitCategory) => void;
  categories: Array<{ name: HabitCategory; color: string; icon: string }>;
  isCategoryOpen: boolean;
  setIsCategoryOpen: (isOpen: boolean) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  category,
  setCategory,
  categories,
  isCategoryOpen,
  setIsCategoryOpen,
}) => {
  return (
    <Popover open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isCategoryOpen}
          className="w-full justify-between"
        >
          <span>{category}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar categorias..." />
          <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
          <CommandGroup>
            {categories.map((cat) => (
              <CommandItem
                key={cat.name}
                value={cat.name}
                onSelect={() => {
                  setCategory(cat.name);
                  setIsCategoryOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    category === cat.name ? "opacity-100" : "opacity-0"
                  )}
                />
                <span style={{ color: cat.color }}>{cat.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
