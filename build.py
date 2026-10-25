#!/usr/bin/env python3
"""Builds the two Spiritual Sojourn landing pages from template.html.

  payment page   every Register button opens the payment link
  WhatsApp page  Register opens a WhatsApp-number step, then the registration link

Edit the copy in template.html, then run:

  python3 build.py
      GitHub Pages copy in this repo: pay/index.html and register/index.html

  python3 build.py --render ../guru-sanidhya-public/public/spiritualsojourn
      Copy for www.gujaratashram.org/spiritualsojourn (the Guru Sanidhya app on Render):
      index.html (payment page), register/index.html (WhatsApp page), plus assets, img and video.

Links, dates and the optional seats meter live in assets/gg.js.
"""
import pathlib, re, shutil, sys

LIVE = "https://www.gujaratashram.org/spiritualsojourn"  # the public address; used for share previews
OG = "img/og.jpg?v=4"
here = pathlib.Path(__file__).resolve().parent
tpl = (here / "template.html").read_text(encoding="utf-8")


def page(mode, base, canonical):
    keep, drop = ("pay", "lead") if mode == "pay" else ("lead", "pay")
    html = tpl.replace("{{MODE}}", mode)
    html = re.sub(rf"\n?[ \t]*<!--{drop}-->.*?<!--/{drop}-->", "", html, flags=re.S)
    html = re.sub(rf"<!--/?{keep}-->", "", html)
    html = html.replace('content="../img/og.jpg"', f'content="{LIVE}/{OG}"')
    for d in ("assets", "img", "video"):
        html = html.replace(f'"../{d}/', f'"{base}{d}/')
    return re.sub(r"<title>", f'<link rel="canonical" href="{canonical}">\n<title>', html, count=1)


def write(path, html):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")
    print("wrote", path)


if "--render" in sys.argv:
    out = pathlib.Path(sys.argv[sys.argv.index("--render") + 1]).resolve()
    base = "/spiritualsojourn/"
    write(out / "index.html", page("pay", base, LIVE))
    write(out / "register" / "index.html", page("lead", base, f"{LIVE}/register"))
    for d in ("assets", "img", "video"):
        shutil.copytree(here / d, out / d, dirs_exist_ok=True)
        print("copied", out / d)
else:
    write(here / "pay" / "index.html", page("pay", "../", LIVE))
    write(here / "register" / "index.html", page("lead", "../", f"{LIVE}/register"))
