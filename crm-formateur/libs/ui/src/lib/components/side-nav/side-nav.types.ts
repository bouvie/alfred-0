export interface NavItem {
  id: string;
  label: string;
  icon: string; // SVG path data
  route: string;
  badge?: number;
}
