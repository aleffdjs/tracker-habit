
import React from 'react';
import { Check, ChevronDown, Search, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup } from '@/components/ui/command';
import { cn } from '@/lib/utils';

// Nomes de ícones comuns para hábitos
const COMMON_ICONS = [
  'Activity', 'Award', 'Book', 'BookOpen', 'Brain', 'Dumbbell', 'Flame',
  'Heart', 'Laptop', 'Leaf', 'Monitor', 'Moon', 'MusicNote', 'Pencil',
  'PenLine', 'Pill', 'Pizza', 'Play', 'Runner', 'Smile', 'Sun', 'User',
  'Utensils', 'Water', 'Circle', 'CheckCircle'
];

interface IconSelectorProps {
  icon: string;
  setIcon: (icon: string) => void;
  isIconOpen: boolean;
  setIsIconOpen: (isOpen: boolean) => void;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  icon,
  setIcon,
  isIconOpen,
  setIsIconOpen,
}) => {
  const [iconSearchTerm, setIconSearchTerm] = React.useState('');

  // Filtrar ícones com base no termo de pesquisa
  const filteredIcons = iconSearchTerm
    ? COMMON_ICONS.filter(iconName => 
        iconName.toLowerCase().includes(iconSearchTerm.toLowerCase())
      )
    : COMMON_ICONS;

  const renderIconPreview = (iconName: string) => {
    try {
      const IconComponent = require('lucide-react')[iconName];
      return IconComponent ? <IconComponent size={18} /> : <Circle size={18} />;
    } catch {
      return <Circle size={18} />;
    }
  };

  return (
    <Popover open={isIconOpen} onOpenChange={setIsIconOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isIconOpen}
          className="w-full justify-between"
        >
          <div className="flex items-center">
            {renderIconPreview(icon)}
            <span className="ml-2">{icon}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              placeholder="Buscar ícones..."
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={iconSearchTerm}
              onChange={(e) => setIconSearchTerm(e.target.value)}
            />
          </div>
          <CommandEmpty>Nenhum ícone encontrado.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            <div className="grid grid-cols-5 gap-2 p-2">
              {filteredIcons.map((iconName) => (
                <div
                  key={iconName}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground",
                    icon === iconName && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => {
                    setIcon(iconName);
                    setIsIconOpen(false);
                  }}
                  title={iconName}
                >
                  {renderIconPreview(iconName)}
                </div>
              ))}
            </div>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
