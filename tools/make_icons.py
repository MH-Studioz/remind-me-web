#!/usr/bin/env python3
"""Draws the app icons: a solid black hourglass on warm paper.

Self-contained on purpose — this repo does not need the iOS or Android assets,
only the three PNG sizes the manifest and the touch icon ask for.

Run `python tools/make_icons.py` to regenerate them.
"""

from __future__ import annotations

import math
import pathlib
import struct
import zlib

ROOT = pathlib.Path(__file__).resolve().parents[1]
ICONS = ROOT / "icons"

CANVAS = 1024.0
PAPER = (242, 237, 228)
INK = (23, 23, 26)

BODY = [
    (330.0, 312.0),
    (694.0, 312.0),
    (538.0, 512.0),
    (694.0, 712.0),
    (330.0, 712.0),
    (486.0, 512.0),
]
CAP_TOP = (300.0, 268.0, 724.0, 312.0)
CAP_BOTTOM = (300.0, 712.0, 724.0, 756.0)
CAP_RADIUS = 14.0


def point_in_polygon(px: float, py: float, polygon) -> bool:
    inside = False
    count = len(polygon)
    for i in range(count):
        x0, y0 = polygon[i]
        x1, y1 = polygon[(i + 1) % count]
        if (y0 > py) != (y1 > py):
            crossing = x0 + (py - y0) * (x1 - x0) / (y1 - y0)
            if px < crossing:
                inside = not inside
    return inside


def inside_rounded_rect(px: float, py: float, rect, radius: float) -> bool:
    x0, y0, x1, y1 = rect
    if px < x0 or px > x1 or py < y0 or py > y1:
        return False
    nearest_x = min(max(px, x0 + radius), x1 - radius)
    nearest_y = min(max(py, y0 + radius), y1 - radius)
    return math.hypot(px - nearest_x, py - nearest_y) <= radius


def covered(px: float, py: float) -> bool:
    return (
        point_in_polygon(px, py, BODY)
        or inside_rounded_rect(px, py, CAP_TOP, CAP_RADIUS)
        or inside_rounded_rect(px, py, CAP_BOTTOM, CAP_RADIUS)
    )


def render(size: int, supersample: int | None = None):
    samples = supersample or 4
    scale = size / CANVAS
    step = 1.0 / samples
    total = samples * samples

    rows = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            hits = 0
            for sy in range(samples):
                for sx in range(samples):
                    if covered((x + (sx + 0.5) * step) / scale, (y + (sy + 0.5) * step) / scale):
                        hits += 1
            if hits == 0:
                row += bytes(PAPER)
            elif hits == total:
                row += bytes(INK)
            else:
                blend = hits / total
                row += bytes(
                    int(round(PAPER[channel] + (INK[channel] - PAPER[channel]) * blend))
                    for channel in range(3)
                )
        rows.append(row)
    return rows


def write_png(path: pathlib.Path, size: int, rows) -> None:
    raw = b"".join(b"\x00" + bytes(row) for row in rows)

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    png = (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 9))
        + chunk(b"IEND", b"")
    )
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png)
    print(f"wrote {path.relative_to(ROOT)} ({size}x{size})")


def main() -> None:
    write_png(ICONS / "icon-180.png", 180, render(180))
    write_png(ICONS / "icon-192.png", 192, render(192))
    write_png(ICONS / "icon-512.png", 512, render(512))


if __name__ == "__main__":
    main()
