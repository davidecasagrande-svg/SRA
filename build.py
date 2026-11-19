#!/usr/bin/env python3
"""Build index.html — one self-contained page that works offline.

    python3 build.py

Sources (edit these, never index.html):
  src/head.html     page shell: design-system styles + script list
  src/app.dc.html   the app itself (template + logic)
  src/js/*.js       app libraries (forms, tables, PDF/Excel templates, runtime)
  src/vendor/*.js   React 18.3.1, ReactDOM 18.3.1, JSZip 3.10.1
  src/fonts/*.woff2 Barlow fonts used by the styles
"""
import base64, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'src')


def read(*p, mode='r'):
    with open(os.path.join(SRC, *p), mode, **({} if 'b' in mode else {'encoding': 'utf-8'})) as f:
        return f.read()


def js_tag(code):
    return '<script>' + code.replace('</script', '<\\/script') + '\n</script>\n'


def main():
    head = read('head.html')
    app = read('app.dc.html')
    html = head + app

    # Scripts referenced by the shell are moved into <head> (in order) so the runtime
    # doesn't load them a second time from the template.
    names = re.findall(r'<script src="js/([^"]+)"></script>', html)
    html = re.sub(r'[ \t]*<script src="js/[^"]+"></script>\n?', '', html)

    # Fonts as data URIs.
    html = re.sub(r'url\("fonts/([^"]+)"\)',
                  lambda m: 'url("data:font/woff2;base64,%s")' % base64.b64encode(read('fonts', m.group(1), mode='rb')).decode(),
                  html)

    pre = ('<title>New South Wales Slope Risk Assessment</title>\n'
           '<meta name="description" content="Field app for slope risk assessment to TfNSW standards">\n'
           # images only from the app itself (blocks the template's unfilled {{ }} image placeholders)
           '<meta http-equiv="Content-Security-Policy" content="img-src data: blob:">\n'
           # tells the runtime the template is already in the page (no refetch of index.html)
           '<script>window.__resources={};</script>\n'
           + js_tag(read('vendor', 'react.production.min.js'))
           + js_tag(read('vendor', 'react-dom.production.min.js'))
           + js_tag(read('vendor', 'jszip.min.js'))
           + ''.join(js_tag(read('js', n)) for n in names))
    html = html.replace('</head>', pre + '</head>', 1)

    out = os.path.join(ROOT, 'index.html')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html)
    print('index.html', len(html) // 1024, 'KB,', len(names), 'scripts')


if __name__ == '__main__':
    main()
