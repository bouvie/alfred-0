import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TopBarComponent, SideNavComponent } from '@org/ui';
import { NAV_ITEMS } from './core/nav/nav.config';
import type { NavItem } from '@org/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopBarComponent, SideNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App {
  private readonly router = inject(Router);

  readonly navItems = NAV_ITEMS;
  readonly sidenavCollapsed = signal(false);

  private readonly navEnd = toSignal(
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)),
  );

  readonly activeRoute = computed(() => {
    this.navEnd();
    return this.router.url.split('?')[0];
  });

  readonly pageTitle = computed(() => {
    const item = NAV_ITEMS.find(n => this.activeRoute().startsWith(n.route));
    return item?.label ?? '';
  });

  toggleSidenav(): void {
    this.sidenavCollapsed.update(v => !v);
  }

  navigate(item: NavItem): void {
    this.router.navigate([item.route]);
  }
}
