import { computed, Injectable, signal } from '@angular/core';
import type { Session, User } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase-client';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabase = getSupabaseClient();

  private readonly sessionSignal = signal<Session | null>(null);
  private readonly initializedSignal = signal(false);

  readonly session = this.sessionSignal.asReadonly();
  readonly user = computed<User | null>(() => this.sessionSignal()?.user ?? null);
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);
  readonly initialized = this.initializedSignal.asReadonly();

  constructor() {
    void this.initialize();
  }

  private async initialize(): Promise<void> {
    const { data } = await this.supabase.auth.getSession();
    this.sessionSignal.set(data.session);

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionSignal.set(session);
    });

    this.initializedSignal.set(true);
  }

  async signInWithPassword(email: string, password: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  getAccessToken(): string | null {
    return this.sessionSignal()?.access_token ?? null;
  }
}
