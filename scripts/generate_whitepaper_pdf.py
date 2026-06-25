#!/usr/bin/env python3
"""Generate the branded Sacchan Token (SAC) whitepaper PDF.

Zero external dependencies — uses only the Python standard library so it runs
fully offline. Outputs to ``public/whitepaper.pdf`` which the "Read Whitepaper"
buttons on the landing page link to.

Run:  python3 scripts/generate_whitepaper_pdf.py
"""

from __future__ import annotations

import os
import struct
import zlib

# --------------------------------------------------------------------------- #
# Brand palette (mirrors tailwind.config.ts / globals.css)
# --------------------------------------------------------------------------- #
INK = (0x04 / 255, 0x07 / 255, 0x0D / 255)        # page background
PANEL = (0x08 / 255, 0x11 / 255, 0x1F / 255)      # card background
GOLD = (0xD7 / 255, 0xB5 / 255, 0x6D / 255)
CREAM = (0xF5 / 255, 0xEA / 255, 0xD7 / 255)
BLUE = (0x63 / 255, 0xA7 / 255, 0xFF / 255)
SLATE = (0xB6 / 255, 0xC0 / 255, 0xD0 / 255)      # body text
MUTED = (0x7A / 255, 0x88 / 255, 0x9C / 255)

PAGE_W, PAGE_H = 595.276, 841.890                 # A4 in points
MARGIN = 56.0
CONTENT_W = PAGE_W - 2 * MARGIN

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LOGO_PATH = os.path.join(ROOT, "public", "logo.JPG")
OUT_PATH = os.path.join(ROOT, "public", "whitepaper.pdf")

VERSION = "v1.0"
PUBLISHED = "2026"


# --------------------------------------------------------------------------- #
# Minimal PDF object model
# --------------------------------------------------------------------------- #
class PDF:
    def __init__(self) -> None:
        self.objects: list[bytes | None] = []

    def add(self, data: bytes) -> int:
        self.objects.append(data)
        return len(self.objects)  # 1-based object number

    def reserve(self) -> int:
        self.objects.append(None)
        return len(self.objects)

    def set(self, num: int, data: bytes) -> None:
        self.objects[num - 1] = data

    def build(self) -> bytes:
        out = bytearray(b"%PDF-1.5\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0] * (len(self.objects) + 1)
        for i, obj in enumerate(self.objects, start=1):
            assert obj is not None, f"object {i} never set"
            offsets[i] = len(out)
            out += f"{i} 0 obj\n".encode("latin-1") + obj + b"\nendobj\n"
        xref_pos = len(out)
        n = len(self.objects) + 1
        out += f"xref\n0 {n}\n".encode("latin-1")
        out += b"0000000000 65535 f \n"
        for i in range(1, n):
            out += f"{offsets[i]:010d} 00000 n \n".encode("latin-1")
        out += b"trailer\n"
        out += f"<< /Size {n} /Root {self.catalog} 0 R >>\n".encode("latin-1")
        out += b"startxref\n" + str(xref_pos).encode("latin-1") + b"\n%%EOF\n"
        return bytes(out)


def jpeg_info(path: str) -> tuple[int, int, int]:
    """Return (width, height, components) for a baseline/progressive JPEG."""
    with open(path, "rb") as fh:
        data = fh.read()
    i = 2  # skip SOI
    while i < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        marker = data[i + 1]
        if marker in (0xD8, 0xD9) or 0xD0 <= marker <= 0xD7:
            i += 2
            continue
        seg_len = struct.unpack(">H", data[i + 2:i + 4])[0]
        if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                      0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
            h = struct.unpack(">H", data[i + 5:i + 7])[0]
            w = struct.unpack(">H", data[i + 7:i + 9])[0]
            comps = data[i + 9]
            return w, h, comps
        i += 2 + seg_len
    raise ValueError("Could not read JPEG dimensions")


# --------------------------------------------------------------------------- #
# Content-stream drawing helpers
# --------------------------------------------------------------------------- #
# Map common Unicode punctuation to WinAnsiEncoding code points so the standard
# Helvetica fonts render them correctly.
_WINANSI = {
    "—": "\x97",  # em dash
    "–": "\x96",  # en dash
    "•": "\x95",  # bullet
    "·": "\xb7",  # middle dot
    "‘": "\x91", "’": "\x92",  # curly single quotes
    "“": "\x93", "”": "\x94",  # curly double quotes
    "…": "\x85",  # ellipsis
}


def esc(text: str) -> str:
    for uni, win in _WINANSI.items():
        text = text.replace(uni, win)
    return text.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


# Approximate Helvetica glyph advance (em fraction) for word wrapping.
_AVG_REG = 0.512
_AVG_BOLD = 0.545


def text_width(text: str, size: float, bold: bool) -> float:
    return len(text) * size * (_AVG_BOLD if bold else _AVG_REG)


def wrap(text: str, size: float, max_w: float, bold: bool) -> list[str]:
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        trial = w if not cur else cur + " " + w
        if text_width(trial, size, bold) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


class Canvas:
    """Accumulates a single page's drawing operators."""

    def __init__(self) -> None:
        self.ops: list[str] = []

    def rect(self, x: float, y: float, w: float, h: float, color) -> None:
        r, g, b = color
        self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} rg")
        self.ops.append(f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re f")

    def line(self, x1, y1, x2, y2, color, width=0.8) -> None:
        r, g, b = color
        self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} RG {width:.2f} w")
        self.ops.append(f"{x1:.2f} {y1:.2f} m {x2:.2f} {y2:.2f} l S")

    def text(self, x, y, s, size, color, bold=False, font="F1") -> None:
        font = "F2" if bold else font
        r, g, b = color
        self.ops.append("BT")
        self.ops.append(f"/{font} {size:.2f} Tf")
        self.ops.append(f"{r:.4f} {g:.4f} {b:.4f} rg")
        self.ops.append(f"1 0 0 1 {x:.2f} {y:.2f} Tm")
        self.ops.append(f"({esc(s)}) Tj")
        self.ops.append("ET")

    def image(self, name, x, y, w, h) -> None:
        self.ops.append("q")
        self.ops.append(f"{w:.2f} 0 0 {h:.2f} {x:.2f} {y:.2f} cm")
        self.ops.append(f"/{name} Do")
        self.ops.append("Q")

    def stream(self) -> bytes:
        return "\n".join(self.ops).encode("latin-1")


# --------------------------------------------------------------------------- #
# Whitepaper content
# --------------------------------------------------------------------------- #
SECTIONS = [
    ("1", "What Is Sacchan?", [
        ("p", "Sacchan was a famously chubby dog who lived in Osaka, Japan. His owner "
              "noticed he kept gaining weight and could not understand why. A 1992 "
              "investigation by the television show Knight Scoop revealed the answer: "
              "Sacchan walked the same route through town every day, and dozens of "
              "people fed him along the way."),
        ("p", "Shop owners, station workers, neighbors, residents, and complete "
              "strangers all contributed small acts of generosity. No single person was "
              "responsible for him. Instead, an entire decentralized network of people "
              "collectively kept him healthy, happy, and loved."),
        ("callout", "Small Contributions. Massive Impact. — that is the philosophy behind SAC."),
    ]),
    ("2", "The Legend, Step by Step", [
        ("step", ("Owner notices the change",
                  "Sacchan keeps getting bigger, and curiosity turns into investigation.")),
        ("step", ("The route is traced",
                  "A reporter follows the dog through Osaka streets, station fronts, and shop corners.")),
        ("step", ("Dozens of hands feed him",
                  "Shop owners, workers, neighbors, and strangers all offer snacks, meals, and affection.")),
        ("step", ("A town becomes a network",
                  "No single sponsor — only distributed generosity creating collective value.")),
    ]),
    ("3", "From a Town to a Blockchain", [
        ("p", "The story of Sacchan is a real-world picture of how decentralized "
              "networks create value. Map the town onto a blockchain and the parallel "
              "is almost exact:"),
        ("compare", ("Contributors", "Many people contribute in town",
                     "Many users contribute in the network")),
        ("compare", ("Coordination", "No central coordinator", "No central authority")),
        ("compare", ("Value creation", "Shared care creates growth",
                     "Shared incentives create ecosystem value")),
        ("compare", ("Outcome", "Sacchan becomes a beloved mascot",
                     "SAC becomes a shared community asset")),
    ]),
    ("4", "What Is SAC?", [
        ("p", "SAC is the token representation of Sacchan's collective model. It is "
              "designed so that many small contributions — participation, support, "
              "and engagement — add up to meaningful shared value, with no central "
              "controller required."),
        ("p", "SAC exists to reward participation, coordinate a community, and grow an "
              "ecosystem the way the town grew around one dog: organically, and together."),
        ("bullets", [
            "Reward Token — recognize contribution and participation",
            "Governance Token — give the community a real voice",
            "Community Incentives — fuel campaigns and collective action",
            "Microtransactions — enable many small, frictionless exchanges",
            "Ecosystem Access — unlock features across the network",
            "Future Staking — align long-term supporters with the project",
        ]),
    ]),
    ("5", "Token Snapshot & Distribution", [
        ("facts", [
            ("Token Name", "Sacchan Token"),
            ("Symbol", "SAC"),
            ("Theme", "Community-driven value"),
            ("Identity", "The legendary Osaka dog"),
        ]),
        ("p", "Indicative allocation. Final mechanics will be confirmed at token "
              "launch and published transparently to the community."),
        ("dist", [
            ("Community", 34, GOLD),
            ("Rewards", 24, BLUE),
            ("Treasury", 18, (0x34/255, 0xD3/255, 0x99/255)),
            ("Ecosystem", 24, (0xA7/255, 0x8B/255, 0xFA/255)),
        ]),
    ]),
    ("6", "Roadmap", [
        ("phase", ("Phase 1", "Story & Community",
                   "Build the legend, launch the community, and establish the identity.")),
        ("phase", ("Phase 2", "Token Launch",
                   "Introduce SAC with transparent token mechanics and fair participation.")),
        ("phase", ("Phase 3", "Reward Ecosystem",
                   "Activate contribution-based rewards and community campaigns.")),
        ("phase", ("Phase 4", "DAO Governance",
                   "Expand collective decision-making and proposal voting.")),
        ("phase", ("Phase 5", "Global Community Network",
                   "Scale the town spirit into a worldwide network of supporters.")),
    ]),
    ("7", "Frequently Asked Questions", [
        ("faq", ("Who was Sacchan?",
                 "Sacchan was a famously chubby dog from Osaka who became a local "
                 "legend after a 1992 Knight Scoop investigation.")),
        ("faq", ("Why was he famous?",
                 "The show revealed that many people across the town were feeding him "
                 "every day, turning him into a beloved communal mascot.")),
        ("faq", ("How does the story relate to blockchain?",
                 "Sacchan represents decentralized participation: many small "
                 "contributions producing a shared outcome without a central controller.")),
        ("faq", ("What is SAC?",
                 "SAC is the token representation of that collective model, designed "
                 "for rewards, governance, community incentives, and ecosystem growth.")),
    ]),
]

DISCLAIMER = (
    "This document is for informational purposes only and describes a community "
    "brand and future-facing concept. It is not financial, investment, legal, or "
    "tax advice, and it is not an offer or solicitation to buy or sell any asset. "
    "Tokenomics and mechanics shown here are placeholders and may change before "
    "launch. Participate responsibly and do your own research."
)


# --------------------------------------------------------------------------- #
# Layout engine
# --------------------------------------------------------------------------- #
class Layout:
    def __init__(self, pdf: PDF, image_name: str | None) -> None:
        self.pdf = pdf
        self.image_name = image_name
        self.pages: list[Canvas] = []
        self.canvas: Canvas | None = None
        self.y = 0.0

    def new_page(self) -> None:
        c = Canvas()
        c.rect(0, 0, PAGE_W, PAGE_H, INK)          # full-bleed background
        c.rect(0, PAGE_H - 6, PAGE_W, 6, GOLD)     # top accent bar
        self.pages.append(c)
        self.canvas = c
        self.y = PAGE_H - MARGIN - 18

    def ensure(self, need: float) -> None:
        if self.y - need < MARGIN + 24:
            self.footer()
            self.new_page()

    def footer(self) -> None:
        c = self.canvas
        n = len(self.pages)
        c.line(MARGIN, MARGIN, PAGE_W - MARGIN, MARGIN, (1, 1, 1), 0.4)
        c.text(MARGIN, MARGIN - 14, "Sacchan Token (SAC) Whitepaper", 8, MUTED)
        c.text(PAGE_W - MARGIN - 16, MARGIN - 14, str(n), 8, MUTED)

    # -- content blocks --------------------------------------------------- #
    def gap(self, h: float) -> None:
        self.y -= h

    def section_title(self, num: str, title: str) -> None:
        self.ensure(60)
        c = self.canvas
        c.text(MARGIN, self.y, num.zfill(2), 12, GOLD, bold=True)
        c.text(MARGIN + 26, self.y, title, 19, CREAM, bold=True)
        self.y -= 12
        c.line(MARGIN, self.y, MARGIN + 46, self.y, GOLD, 1.6)
        self.y -= 22

    def paragraph(self, text: str, color=SLATE, size=10.5, leading=15.5) -> None:
        for line in wrap(text, size, CONTENT_W, False):
            self.ensure(leading)
            self.canvas.text(MARGIN, self.y, line, size, color)
            self.y -= leading
        self.y -= 4

    def callout(self, text: str) -> None:
        lines = wrap(text, 11, CONTENT_W - 28, True)
        h = 18 + len(lines) * 16
        self.ensure(h + 8)
        top = self.y + 4
        self.canvas.rect(MARGIN, top - h, CONTENT_W, h, PANEL)
        self.canvas.rect(MARGIN, top - h, 3.5, h, GOLD)
        ty = top - 20
        for line in lines:
            self.canvas.text(MARGIN + 16, ty, line, 11, CREAM, bold=True)
            ty -= 16
        self.y = top - h - 12

    def step(self, idx: int, title: str, text: str) -> None:
        lines = wrap(text, 10, CONTENT_W - 44, False)
        h = max(34, 20 + len(lines) * 14)
        self.ensure(h + 6)
        top = self.y + 2
        c = self.canvas
        c.rect(MARGIN, top - h, CONTENT_W, h, PANEL)
        c.text(MARGIN + 14, top - 22, str(idx), 16, GOLD, bold=True)
        c.text(MARGIN + 44, top - 18, title, 11.5, CREAM, bold=True)
        ty = top - 34
        for line in lines:
            c.text(MARGIN + 44, ty, line, 10, SLATE)
            ty -= 14
        self.y = top - h - 8

    def compare(self, label: str, left: str, right: str) -> None:
        self.ensure(46)
        top = self.y + 2
        h = 40
        c = self.canvas
        c.rect(MARGIN, top - h, CONTENT_W, h, PANEL)
        c.text(MARGIN + 14, top - 16, label.upper(), 8.5, GOLD, bold=True)
        midx = MARGIN + CONTENT_W / 2
        c.text(MARGIN + 14, top - 31, "The town:  " + left, 9.5, SLATE)
        c.line(midx, top - h + 6, midx, top - 6, (1, 1, 1), 0.4)
        c.text(midx + 12, top - 31, "The network:  " + right, 9.5, BLUE)
        self.y = top - h - 8

    def bullets(self, items: list[str]) -> None:
        for it in items:
            self.ensure(16)
            self.canvas.text(MARGIN + 4, self.y, "•", 11, GOLD, bold=True)
            self.canvas.text(MARGIN + 18, self.y, it, 10.5, SLATE)
            self.y -= 17
        self.y -= 4

    def facts(self, rows: list[tuple[str, str]]) -> None:
        self.ensure(54)
        cols = 2
        cw = (CONTENT_W - 12) / cols
        ch = 40
        top = self.y + 2
        for i, (label, value) in enumerate(rows):
            col = i % cols
            row = i // cols
            x = MARGIN + col * (cw + 12)
            yy = top - row * (ch + 10)
            c = self.canvas
            c.rect(x, yy - ch, cw, ch, PANEL)
            c.text(x + 12, yy - 16, label.upper(), 8, MUTED, bold=True)
            c.text(x + 12, yy - 31, value, 12, CREAM, bold=True)
        rows_n = (len(rows) + cols - 1) // cols
        self.y = top - rows_n * (ch + 10) - 4

    def dist(self, slices: list[tuple[str, int, tuple]]) -> None:
        # horizontal stacked bar
        self.ensure(34)
        bar_h = 16
        top = self.y
        x = MARGIN
        for label, pct, color in slices:
            w = CONTENT_W * pct / 100.0
            self.canvas.rect(x, top - bar_h, w, bar_h, color)
            x += w
        self.y = top - bar_h - 18
        # legend
        cols = 2
        cw = CONTENT_W / cols
        for i, (label, pct, color) in enumerate(slices):
            col = i % cols
            row = i // cols
            xx = MARGIN + col * cw
            yy = self.y - row * 18
            self.canvas.rect(xx, yy - 2, 10, 10, color)
            self.canvas.text(xx + 16, yy, f"{label} — {pct}%", 10, SLATE)
        rows_n = (len(slices) + cols - 1) // cols
        self.y -= rows_n * 18 + 6

    def phase(self, tag: str, title: str, text: str) -> None:
        lines = wrap(text, 10, CONTENT_W - 130, False)
        h = max(38, 18 + len(lines) * 14)
        self.ensure(h + 6)
        top = self.y + 2
        c = self.canvas
        c.rect(MARGIN, top - h, CONTENT_W, h, PANEL)
        c.rect(MARGIN, top - h, 3.5, h, BLUE)
        c.text(MARGIN + 16, top - 18, tag.upper(), 8.5, BLUE, bold=True)
        c.text(MARGIN + 16, top - 32, title, 11, CREAM, bold=True)
        ty = top - 18
        for line in lines:
            c.text(MARGIN + 120, ty, line, 10, SLATE)
            ty -= 14
        self.y = top - h - 8

    def faq(self, q: str, a: str) -> None:
        self.ensure(24)
        for line in wrap("Q.  " + q, 11, CONTENT_W, True):
            self.canvas.text(MARGIN, self.y, line, 11, CREAM, bold=True)
            self.y -= 15
        self.y -= 1
        for line in wrap(a, 10, CONTENT_W, False):
            self.ensure(14)
            self.canvas.text(MARGIN, self.y, line, 10, SLATE)
            self.y -= 14
        self.y -= 8

    # -- cover ------------------------------------------------------------ #
    def cover(self, img_w: int, img_h: int) -> None:
        self.new_page()
        c = self.canvas
        # soft gold band behind the title block
        c.rect(0, PAGE_H * 0.38, PAGE_W, PAGE_H * 0.30, PANEL)
        if self.image_name:
            size = 150.0
            ratio = img_h / img_w if img_w else 1.0
            iw, ih = size, size * ratio
            if ih > size:
                ih = size
                iw = size / ratio
            cx = (PAGE_W - iw) / 2
            cy = PAGE_H * 0.62
            # gold ring
            c.rect(cx - 6, cy - 6, iw + 12, ih + 12, GOLD)
            c.image(self.image_name, cx, cy, iw, ih)
        c.text(MARGIN, PAGE_H * 0.50, "Sacchan Token", 40, CREAM, bold=True)
        c.text(MARGIN, PAGE_H * 0.50 - 46, "Small Contributions. Massive Impact.",
               16, GOLD, bold=True)
        sub = ("A premium Web3 community network inspired by the true story of "
               "Sacchan, the Osaka dog a whole town fed — a living example of "
               "decentralized generosity.")
        ty = PAGE_H * 0.50 - 78
        for line in wrap(sub, 11.5, CONTENT_W - 40, False):
            c.text(MARGIN, ty, line, 11.5, SLATE)
            ty -= 17
        c.line(MARGIN, 120, PAGE_W - MARGIN, 120, GOLD, 1.0)
        c.text(MARGIN, 100, "WHITEPAPER", 12, GOLD, bold=True)
        c.text(MARGIN, 84, f"{VERSION}  ·  {PUBLISHED}", 10, MUTED)
        c.text(PAGE_W - MARGIN - 70, 84, "Token: SAC", 10, MUTED)


def build_pdf() -> None:
    pdf = PDF()

    # ---- image XObject ------------------------------------------------- #
    image_name = None
    img_w = img_h = 0
    if os.path.exists(LOGO_PATH):
        with open(LOGO_PATH, "rb") as fh:
            raw = fh.read()
        img_w, img_h, comps = jpeg_info(LOGO_PATH)
        cs = {1: "DeviceGray", 3: "DeviceRGB", 4: "DeviceCMYK"}.get(comps, "DeviceRGB")
        img_obj = pdf.reserve()
        hdr = (f"<< /Type /XObject /Subtype /Image /Width {img_w} /Height {img_h} "
               f"/ColorSpace /{cs} /BitsPerComponent 8 /Filter /DCTDecode "
               f"/Length {len(raw)} >>\nstream\n").encode("latin-1")
        pdf.set(img_obj, hdr + raw + b"\nendstream")
        image_name = "Im0"

    # ---- lay out content ----------------------------------------------- #
    layout = Layout(pdf, image_name)
    layout.cover(img_w, img_h)

    layout.new_page()
    for num, title, blocks in SECTIONS:
        layout.section_title(num, title)
        step_i = 0
        for block in blocks:
            kind = block[0]
            if kind == "p":
                layout.paragraph(block[1])
            elif kind == "callout":
                layout.callout(block[1])
            elif kind == "step":
                step_i += 1
                layout.step(step_i, block[1][0], block[1][1])
            elif kind == "compare":
                layout.compare(*block[1])
            elif kind == "bullets":
                layout.bullets(block[1])
            elif kind == "facts":
                layout.facts(block[1])
            elif kind == "dist":
                layout.dist(block[1])
            elif kind == "phase":
                layout.phase(*block[1])
            elif kind == "faq":
                layout.faq(*block[1])
        layout.gap(14)

    # disclaimer
    layout.section_title("8", "Important Notice")
    layout.paragraph(DISCLAIMER, color=MUTED, size=9.5, leading=14)
    layout.footer()

    # ---- assemble document objects ------------------------------------- #
    page_ids = []
    content_ids = []
    for canvas in layout.pages:
        stream = zlib.compress(canvas.stream())
        cid = pdf.add(b"<< /Filter /FlateDecode /Length " +
                      str(len(stream)).encode() + b" >>\nstream\n" +
                      stream + b"\nendstream")
        content_ids.append(cid)
        page_ids.append(pdf.reserve())

    font_reg = pdf.add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
                       b"/Encoding /WinAnsiEncoding >>")
    font_bold = pdf.add(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold "
                        b"/Encoding /WinAnsiEncoding >>")

    pages_id = pdf.reserve()
    xobj = ""
    if image_name:
        xobj = f"/XObject << /{image_name} {1} 0 R >> "  # image is object 1
    resources = (f"<< /Font << /F1 {font_reg} 0 R /F2 {font_bold} 0 R >> "
                 f"{xobj}>>").encode("latin-1")

    for pid, cid in zip(page_ids, content_ids):
        pdf.set(pid,
                (f"<< /Type /Page /Parent {pages_id} 0 R "
                 f"/MediaBox [0 0 {PAGE_W:.3f} {PAGE_H:.3f}] "
                 f"/Resources ").encode("latin-1") + resources +
                f" /Contents {cid} 0 R >>".encode("latin-1"))

    kids = " ".join(f"{pid} 0 R" for pid in page_ids)
    pdf.set(pages_id,
            f"<< /Type /Pages /Count {len(page_ids)} /Kids [{kids}] >>".encode("latin-1"))

    catalog = pdf.add(f"<< /Type /Catalog /Pages {pages_id} 0 R >>".encode("latin-1"))
    pdf.catalog = catalog

    data = pdf.build()
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "wb") as fh:
        fh.write(data)
    print(f"Wrote {OUT_PATH} ({len(data):,} bytes, {len(page_ids)} pages)")


if __name__ == "__main__":
    build_pdf()
