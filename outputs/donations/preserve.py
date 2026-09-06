import io,base64,zipfile,xml.etree.ElementTree as E,json,re,copy
from pathlib import Path
base=Path('outputs/donations'); original=Path(r'C:/Users/srika/Downloads/Ganesh 2026.xlsx')
ns={'m':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
audit=json.loads((base/'audit.json').read_text())
with zipfile.ZipFile(original) as z:
 xml=z.read('xl/worksheets/sheet2.xml').decode(); originalxml=xml
 root=E.fromstring(xml); cells={c.attrib['r']:c for c in root.findall('.//m:c',ns)}
 styles=z.read('xl/styles.xml').decode(); sr=E.fromstring(styles); xfs=sr.find('m:cellXfs',ns)
 date_styles={}; extra=[]
 for a in audit:
  for col,idx in [('C',2),('D',3),('F',5)]:
   dest=f"{col}{a['dst']}"; source=f"{col}{a['src']}"; old=cells[dest]; style=old.get('s','0')
   if col=='D' and xfs[int(style)].get('numFmtId')!=xfs[int(cells[source].get('s','0'))].get('numFmtId'):
    if style not in date_styles:
     new=copy.deepcopy(xfs[int(style)]); new.set('numFmtId',xfs[int(cells[source].get('s','0'))].get('numFmtId')); new.set('applyNumberFormat','1')
     E.register_namespace('',ns['m']); extra.append(E.tostring(new,encoding='unicode')); date_styles[style]=str(len(xfs)+len(extra)-1)
    style=date_styles[style]
   val=a['result'][idx]
   if col=='F': content='<is><t>Paid</t></is>'; typ=' t="inlineStr"'
   else: content=f'<v>{val}</v>'; typ=''
   replacement=f'<c r="{dest}" s="{style}"{typ}>{content}</c>'
   pattern=rf'<c\b(?=[^>]*\br="{dest}")[^>]*?(?:/>|>.*?</c>)'
   xml,n=re.subn(pattern,lambda m:replacement,xml,count=1,flags=re.S); assert n==1,dest
 if extra:
  styles=re.sub(r'(<cellXfs count=")\d+("[^>]*>)',lambda m:m[1]+str(len(xfs)+len(extra))+m[2],styles)
  styles=styles.replace('</cellXfs>',''.join(extra)+'</cellXfs>')
 out=io.BytesIO()
 with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as w:
  for item in z.infolist(): w.writestr(copy.copy(item),xml.encode() if item.filename=='xl/worksheets/sheet2.xml' else styles.encode() if item.filename=='xl/styles.xml' else z.read(item.filename))
 with zipfile.ZipFile(out) as check:
  changes=[n for n in z.namelist() if z.read(n)!=check.read(n)]; assert 'xl/worksheets/sheet2.xml' in changes and set(changes)<= {'xl/worksheets/sheet2.xml','xl/styles.xml'},changes
  after={c.attrib['r']:c for c in E.fromstring(check.read('xl/worksheets/sheet2.xml')).findall('.//m:c',ns)}
  allowed={f'{col}{a["dst"]}' for a in audit for col in ['C','D','F']}
  changed={r for r in cells if E.tostring(cells[r])!=E.tostring(after[r])}; assert changed==allowed
  pass
 # Trim names only in a disposable preview copy to avoid the renderer bug.
 preview=io.BytesIO()
 with zipfile.ZipFile(out) as result,zipfile.ZipFile(preview,'w',zipfile.ZIP_DEFLATED) as p:
  for item in result.infolist():
   data=result.read(item.filename)
   if item.filename=='xl/workbook.xml': data=data.replace(b'Donations received ',b'Donations received')
   p.writestr(copy.copy(item),data)



 print(json.dumps({'output':base64.b64encode(out.getvalue()).decode(),'preview':base64.b64encode(preview.getvalue()).decode()}))



