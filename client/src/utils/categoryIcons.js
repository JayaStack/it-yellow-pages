import { 
  Zap, 
  FlaskConical, 
  ShoppingBag, 
  Leaf, 
  Plug, 
  Settings, 
  Utensils, 
  HeartPulse, 
  GraduationCap, 
  Home as HomeIcon,
  Briefcase
} from 'lucide-react';

export const categoryIconMap = {
  zap: Zap,
  'flask-conical': FlaskConical,
  'shopping-bag': ShoppingBag,
  leaf: Leaf,
  plug: Plug,
  settings: Settings,
  utensils: Utensils,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  home: HomeIcon,
  briefcase: Briefcase
};

export const getCategoryIcon = (iconName) => {
  return categoryIconMap[iconName] || Briefcase;
};
