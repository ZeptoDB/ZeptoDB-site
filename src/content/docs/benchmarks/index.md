---
title: "Benchmarks"
template: splash
prev: false
next: false
description: "ZeptoDB performance benchmarks — ingestion, query latency, and Python zero-copy"
---

Reproducible benchmarks on commodity hardware. All numbers measured on a single node unless noted.

---

## Hardware

| Component | Spec |
|-----------|------|
| CPU | AMD EPYC 9654 (96 cores) / Intel Xeon Platinum 8488C |
| RAM | 256 GB DDR5-4800 ECC |
| Storage | NVMe Gen4 (for WAL & Parquet HDB) |
| OS | Amazon Linux 2023, kernel 6.1 |
| Compiler | Clang 19, `-O3 -march=native` |

---

## Ingestion Throughput

| Scenario | Events/sec | Latency (p99) |
|----------|-----------|---------------|
| Single-symbol tick stream | **5.52M** | 181ns |
| Multi-symbol (1,000 syms) | **4.8M** | 210ns |
| Kafka consumer (batch 10K) | **3.2M** | 850μs batch |
| FIX 4.4 market data | **1.1M** | 420ns parse+ingest |

Lock-free MPMC ring buffer with Highway SIMD batch copy. Zero allocation on hot path.

---

## Query Latency

All queries on 1M-row in-memory table, single thread.

| Query | Latency |
|-------|---------|
| `SELECT * FROM trades WHERE sym='AAPL' AND ts > now()-1h` | **272μs** |
| `SELECT avg(price), max(volume) FROM trades GROUP BY sym` | **185μs** |
| `SELECT * FROM trades ASOF JOIN quotes USING(sym, ts)` | **410μs** |
| `SELECT sym, ema(price, 20) FROM trades` | **320μs** |
| `SELECT xbar(1m, ts) as bucket, vwap(price, volume) FROM trades GROUP BY bucket` | **290μs** |
| Window JOIN (±500ms) | **580μs** |

LLVM JIT compilation. Vectorized execution with SIMD aggregation.

---

## Python Zero-Copy

| Operation | Latency |
|-----------|---------|
| `conn.query("SELECT * FROM trades")` → NumPy array | **522ns** |
| DataFrame view (1M rows × 5 cols) | **1.2μs** |
| PyTorch tensor from query result | **890ns** |

Direct memory-mapped view. No serialization, no copy, no Arrow conversion.

---

## Comparison

| | **ZeptoDB** | **kdb+** | **ClickHouse** | **TimescaleDB** | **InfluxDB** |
|---|---|---|---|---|---|
| Ingestion (events/sec) | **5.52M** | ~5M | 100K | 50K | 50K |
| Point query latency | **272μs** | ~300μs | ~5ms | ~10ms | ~15ms |
| ASOF JOIN | ✓ | ✓ | ✗ | ✗ | ✗ |
| SQL | Standard | q lang | ✓ | ✓ | InfluxQL |
| Python zero-copy | **522ns** | IPC (~ms) | — | — | — |
| License cost | **Free (OSS)** | $100K+/yr | Free | Free | Free |

---

## Reproduce

```bash
git clone https://github.com/zeptodb/zeptodb.git && cd zeptodb
mkdir -p build && cd build
cmake .. -G Ninja -DCMAKE_BUILD_TYPE=Release \
  -DCMAKE_C_COMPILER=clang-19 -DCMAKE_CXX_COMPILER=clang++-19
ninja -j$(nproc)

# Ingestion benchmark
./bench/bench_ingestion --symbols 1 --duration 10s

# Query benchmark
./bench/bench_query --rows 1000000 --iterations 100

# Python zero-copy
python3 ../bench/bench_python_zerocopy.py
```

See [benchmark source code](https://github.com/zeptodb/zeptodb/tree/main/bench) for full methodology.
