"""
meta_learning.py — Análise de trajetória e ajuste de estratégia (S4)

Rodado pelo watcher a cada 10 iterações.
Lê ptd_learning_signals.json (branch pipeline-outputs),
analisa slope de pct_ok, ajusta current_strategy e grava meta_insights.

Uso:
  python3 meta_learning.py                 # roda e salva
  python3 meta_learning.py --dry-run       # só imprime, não salva
"""

import json
import sys
import argparse
from pathlib import Path
from datetime import datetime

_SIGNALS_PATH = Path('ptd_learning_signals.json')
_DRY_RUN = '--dry-run' in sys.argv

# ── Carregar sinais ────────────────────────────────────────────────────────────
def _load() -> dict:
    if _SIGNALS_PATH.exists():
        return json.loads(_SIGNALS_PATH.read_text(encoding='utf-8'))
    return {
        'schema_version': 1,
        'run_history': [],
        'meta_insights': [],
        'current_strategy': {
            'focus': 'vocabulario',
            'auto_add_threshold': 8,
            'review_threshold': 3,
            'priority_siglas': [],
        },
    }

# ── Calcular slope de pct_ok sobre janela ─────────────────────────────────────
def _slope(values: list[float]) -> float:
    """pp melhoria por iteração (regressão linear simples)."""
    n = len(values)
    if n < 2:
        return 0.0
    xs = list(range(n))
    x_mean = sum(xs) / n
    y_mean = sum(values) / n
    num = sum((x - x_mean) * (y - y_mean) for x, y in zip(xs, values))
    den = sum((x - x_mean) ** 2 for x in xs)
    return round(num / den, 4) if den else 0.0

# ── Identificar siglas estagnadas ─────────────────────────────────────────────
def _stalled_siglas(history: list[dict], window: int = 5) -> list[str]:
    """Siglas cujo pct_ok não melhorou nas últimas `window` entradas."""
    if len(history) < window:
        return []
    recent = history[-window:]
    stalled = []
    all_siglas: set[str] = set()
    for entry in recent:
        all_siglas.update(entry.get('per_sigla_ok', {}).keys())
    for sig in all_siglas:
        vals = [e['per_sigla_ok'].get(sig) for e in recent
                if e.get('per_sigla_ok', {}).get(sig) is not None]
        if len(vals) >= 3 and max(vals) - min(vals) < 1.0:
            stalled.append(sig)
    return stalled

# ── Decisão de estratégia ─────────────────────────────────────────────────────
_STRATEGY_ORDER = ['vocabulario', 'col_keys', 'eixo_regex', 'human_review']

def _next_strategy(current: str, slope: float) -> tuple[str, str]:
    """Retorna (nova_estratégia, razão)."""
    if slope >= 0.3:
        return current, f'slope={slope:.3f}pp/iter ≥ 0.3 — mantendo {current}'
    elif slope >= 0.1:
        # Ajustar thresholds dentro da mesma estratégia
        return current, f'slope={slope:.3f}pp/iter [0.1,0.3) — ajustando thresholds'
    else:
        # Trocar para próxima estratégia
        idx = _STRATEGY_ORDER.index(current) if current in _STRATEGY_ORDER else 0
        nxt = _STRATEGY_ORDER[min(idx + 1, len(_STRATEGY_ORDER) - 1)]
        return nxt, f'slope={slope:.3f}pp/iter < 0.1 — trocando {current} → {nxt}'

# ── Ajustar thresholds dinamicamente ─────────────────────────────────────────
def _adjusted_thresholds(slope: float, current: dict) -> tuple[int, int]:
    auto_add = current.get('auto_add_threshold', 8)
    review   = current.get('review_threshold', 3)
    if 0.1 <= slope < 0.3:
        auto_add = max(3, auto_add - 1)
        review   = max(1, review - 1)
    elif slope >= 0.3:
        # Progressão bem-sucedida — manter ou endurecer levemente
        auto_add = min(10, auto_add)
    return auto_add, review

# ── Main ───────────────────────────────────────────────────────────────────────
def run(window: int = 10) -> dict:
    signals = _load()
    history = signals.get('run_history', [])
    current_strategy = signals.get('current_strategy', {})

    iteration = history[-1]['iteration'] if history else 0
    n_entries = len(history)

    if n_entries < 2:
        print(f'[meta_learning] Apenas {n_entries} entrada(s) — nada a analisar.')
        return signals

    recent = history[-window:]
    pct_ok_values = [e['pct_ok'] for e in recent if e.get('pct_ok') is not None]
    slope = _slope(pct_ok_values)

    stalled = _stalled_siglas(history, window=min(window, n_entries))
    current_focus = current_strategy.get('focus', 'vocabulario')
    new_focus, reasoning = _next_strategy(current_focus, slope)
    auto_add, review_thr = _adjusted_thresholds(slope, current_strategy)

    # Priority siglas: estagnadas + as que já eram prioritárias
    existing_priority = set(current_strategy.get('priority_siglas', []))
    new_priority = sorted(existing_priority | set(stalled))

    # Dominant action nos últimos ciclos
    actions = [e.get('action_type', '') for e in recent]
    dominant = max(set(actions), key=actions.count) if actions else 'desconhecido'

    insight = {
        'at_iteration': iteration,
        'window': len(recent),
        'n_history': n_entries,
        'pct_ok_start': pct_ok_values[0] if pct_ok_values else None,
        'pct_ok_end':   pct_ok_values[-1] if pct_ok_values else None,
        'slope_pct_ok_per_iter': slope,
        'dominant_action': dominant,
        'stalled_siglas': stalled,
        'strategy_prev': current_focus,
        'strategy_next': new_focus,
        'auto_add_threshold_new': auto_add,
        'review_threshold_new': review_thr,
        'reasoning': reasoning,
        'ts': datetime.utcnow().isoformat(timespec='seconds') + 'Z',
    }

    print(f'[meta_learning] iter={iteration} | window={len(recent)} entradas')
    print(f'  pct_ok: {pct_ok_values[0] if pct_ok_values else "?":.1f}% → {pct_ok_values[-1] if pct_ok_values else "?":.1f}%')
    print(f'  slope:  {slope:+.3f} pp/iter')
    print(f'  ação dominante: {dominant}')
    print(f'  estratégia: {current_focus} → {new_focus}')
    print(f'  thresholds: auto_add={auto_add}, review={review_thr}')
    if stalled:
        print(f'  estagnadas: {stalled}')
    print(f'  razão: {reasoning}')

    # Atualizar signals
    signals['meta_insights'].append(insight)
    signals['current_strategy'] = {
        'focus': new_focus,
        'auto_add_threshold': auto_add,
        'review_threshold': review_thr,
        'priority_siglas': new_priority,
    }

    if not _DRY_RUN:
        _SIGNALS_PATH.write_text(
            json.dumps(signals, ensure_ascii=False, indent=2), encoding='utf-8')
        print(f'[meta_learning] Salvo em {_SIGNALS_PATH}')
    else:
        print('[meta_learning] --dry-run: não salvo.')

    return signals


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--window', type=int, default=10)
    args = parser.parse_args()
    _DRY_RUN = args.dry_run
    run(window=args.window)
