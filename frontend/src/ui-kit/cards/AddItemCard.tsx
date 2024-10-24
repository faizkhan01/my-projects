import { CardActionArea, Typography, Card } from '@mui/material';
import { Plus } from '@phosphor-icons/react';
import { cn } from '../utils';

interface AddCardProps {
  onClick: () => void;
  text: string;
  className?: string;
}

export const AddItemCard = ({ onClick, className, text }: AddCardProps) => {
  return (
    <Card
      className={cn(
        'w-full rounded-[10px] border-2 border-dashed border-text-secondary',
        className,
      )}
      elevation={0}
    >
      <CardActionArea
        onClick={onClick}
        className="flex h-full w-full flex-col items-center justify-center text-text-secondary"
      >
        <Plus size={40} />
        <Typography
          className="text-center text-lg/[28.8px] text-text-secondary"
          component="span"
        >
          {text}
        </Typography>
      </CardActionArea>
    </Card>
  );
};
