import type { LucideIcon } from 'lucide-react/types';
import ArrowRight from 'lucide-react/icons/arrow-right';
import Info from 'lucide-react/icons/info';
import Plus from 'lucide-react/icons/plus';
import Settings from 'lucide-react/icons/settings';
import Trash2 from 'lucide-react/icons/trash-2';

import type { IconName } from './types';

export const icons = {
  plus: Plus,
  trash: Trash2,
  settings: Settings,
  info: Info,
  'arrow-right': ArrowRight,
} as const satisfies Record<IconName, LucideIcon>;

export const iconNames = Object.keys(icons) as IconName[];
