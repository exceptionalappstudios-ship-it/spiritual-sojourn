#!/usr/bin/env python3
"""Builds the two Spiritual Sojourn landing pages from template.html.

  pay/index.html       every Register button opens the payment link
  register/index.html  Register opens a WhatsApp-number step, then the registration link

Edit the copy in template.html, then run:  python3 build.py
Links, dates and the optional seats meter live in assets/gg.js.
"""
import pathlib, re

SITE = "https://exceptionalappstudios-ship-it.github.io/spiritual-sojourn"  # change if you use your own domain
here = pathlib.Path(__file__).resolve().parent
tpl = (here / "template.html").read_text(encoding="utf-8")

for mode, keep, drop, folder in (("pay", "pay", "lead", "pay"), ("lead", "lead", "pay", "register")):
    html = tpl.replace("{{MODE}}", mode)
    html = re.sub(rf"\n?[ \t]*<!--{drop}-->.*?<!--/{drop}-->", "", html, flags=re.S)
    html = re.sub(rf"<!--/?{keep}-->", "", html)
    html = html.replace('content="../img/og.jpg"', f'content="{SITE}/img/og.jpg?v=3"')
    html = re.sub(r"<title>", f'<link rel="canonical" href="{SITE}/{folder}/">\n<title>', html, count=1)
    out = here / folder / "index.html"
    out.parent.mkdir(exist_ok=True)
    out.write_text(html, encoding="utf-8")
    print("wrote", out.relative_to(here.parent))
