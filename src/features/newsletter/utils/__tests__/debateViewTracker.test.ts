import { describe, it, expect, beforeEach } from 'vitest';
import {
  recordDebateView,
  getViewedDebates,
  clearViewedDebates,
  buildNewsletterMetadata,
  DEBATE_VIEWS_STORAGE_KEY,
  MAX_STORED_DEBATES
} from '../debateViewTracker';

describe('debateViewTracker', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts with an empty array of viewed debates', () => {
    expect(getViewedDebates()).toEqual([]);
  });

  it('records a new viewed debate into localStorage', () => {
    recordDebateView({ id: 'deb-1', title: 'Debate Eleições SP' });

    const viewed = getViewedDebates();
    expect(viewed).toHaveLength(1);
    expect(viewed[0].id).toBe('deb-1');
    expect(viewed[0].title).toBe('Debate Eleições SP');
    expect(viewed[0].viewedAt).toBeDefined();
  });

  it('deduplicates when the same debate is viewed again and moves it to the front', () => {
    recordDebateView({ id: 'deb-1', title: 'Debate 1' });
    recordDebateView({ id: 'deb-2', title: 'Debate 2' });
    recordDebateView({ id: 'deb-1', title: 'Debate 1 Atualizado' });

    const viewed = getViewedDebates();
    expect(viewed).toHaveLength(2);
    expect(viewed[0].id).toBe('deb-1');
    expect(viewed[0].title).toBe('Debate 1 Atualizado');
    expect(viewed[1].id).toBe('deb-2');
  });

  it('caps the stored history to MAX_STORED_DEBATES', () => {
    for (let i = 1; i <= MAX_STORED_DEBATES + 5; i++) {
      recordDebateView({ id: `deb-${i}`, title: `Debate ${i}` });
    }

    const viewed = getViewedDebates();
    expect(viewed).toHaveLength(MAX_STORED_DEBATES);
    expect(viewed[0].id).toBe(`deb-${MAX_STORED_DEBATES + 5}`);
  });

  it('clears stored debates with clearViewedDebates()', () => {
    recordDebateView({ id: 'deb-1', title: 'Debate 1' });
    expect(getViewedDebates()).toHaveLength(1);

    clearViewedDebates();
    expect(getViewedDebates()).toEqual([]);
    expect(window.localStorage.getItem(DEBATE_VIEWS_STORAGE_KEY)).toBeNull();
  });

  it('builds comprehensive newsletter metadata including current debate and history', () => {
    recordDebateView({ id: 'deb-1', title: 'Debate 1' });

    const metadata = buildNewsletterMetadata({ id: 'deb-current', title: 'Debate Atual' });
    expect(metadata.viewedDebates).toHaveLength(1);
    expect(metadata.viewedDebates[0].id).toBe('deb-1');
    expect(metadata.currentDebate).toEqual({ id: 'deb-current', title: 'Debate Atual' });
    expect(metadata.subscribedAt).toBeDefined();
  });
});
