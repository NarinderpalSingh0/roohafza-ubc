export type HeroState = "arrival" | "heritage" | "future" | "complete";

export type HeroEvent =
  | { type: "SCROLL_PAST_HERO" }
  | { type: "SCROLL_TO_HERITAGE" }
  | { type: "SCROLL_TO_FUTURE" }
  | { type: "REACHED_END" }
  | { type: "RESET" };

const HERO_TRANSITIONS: Record<HeroState, Partial<Record<HeroEvent["type"], HeroState>>> = {
  arrival: {
    SCROLL_PAST_HERO: "heritage",
  },
  heritage: {
    SCROLL_TO_FUTURE: "future",
    SCROLL_PAST_HERO: "future",
    RESET: "arrival",
  },
  future: {
    REACHED_END: "complete",
    SCROLL_TO_HERITAGE: "heritage",
    RESET: "arrival",
  },
  complete: {
    RESET: "arrival",
  },
} as const;

export type HeroSnapshot = {
  readonly state: HeroState;
  readonly previousState: HeroState | null;
  readonly changedAt: number;
};

export type HeroListener = (snapshot: HeroSnapshot) => void;

export function createHeroMachine() {
  let current: HeroState = "arrival";
  let previous: HeroState | null = null;
  let changedAt = Date.now();
  const listeners = new Set<HeroListener>();

  function notify(): void {
    const snapshot: HeroSnapshot = {
      state: current,
      previousState: previous,
      changedAt,
    };
    for (const listener of listeners) {
      listener(snapshot);
    }
  }

  function send(event: HeroEvent["type"]): HeroState {
    const transitions = HERO_TRANSITIONS[current];
    const next = transitions[event];
    if (next && next !== current) {
      previous = current;
      current = next;
      changedAt = Date.now();
      notify();
    }
    return current;
  }

  function subscribe(listener: HeroListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function getState(): HeroSnapshot {
    return {
      state: current,
      previousState: previous,
      changedAt,
    };
  }

  function reset(): void {
    send("RESET");
  }

  return {
    send,
    subscribe,
    getState,
    reset,
  } as const;
}
