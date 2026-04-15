import { NavItem } from '@org/ui';

const ICON_PIPELINE = 'M3 6h14M3 10h14M3 14h10';
const ICON_CONTACTS = 'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM9 14H5a4 4 0 0 0-4 4v1h16v-1a4 4 0 0 0-4-4h-4z';
const ICON_SESSIONS = 'M3 4h14v14H3zM7 2v4M13 2v4M3 9h14';
const ICON_DASHBOARD = 'M3 3h6v6H3zM11 3h6v6h-6zM3 11h6v6H3zM11 11h6v6h-6z';

export const NAV_ITEMS: NavItem[] = [
  { id: 'pipeline',  label: 'Pipeline',  icon: ICON_PIPELINE,  route: '/pipeline'  },
  { id: 'contacts',  label: 'Contacts',  icon: ICON_CONTACTS,  route: '/contacts'  },
  { id: 'sessions',  label: 'Sessions',  icon: ICON_SESSIONS,  route: '/sessions'  },
  { id: 'dashboard', label: 'Tableau de bord', icon: ICON_DASHBOARD, route: '/dashboard' },
];
