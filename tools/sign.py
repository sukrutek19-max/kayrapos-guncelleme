# sign.py <keyfile> <installer.exe> <version> <notes.txt> <out stable.json> [indirme adresi kökü]
import sys,json,base64,hashlib,os,datetime
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey
key,exe,ver,notes,out=sys.argv[1:6]
base=sys.argv[6] if len(sys.argv)>6 else "https://raw.githubusercontent.com/sukrutek19-max/kayrapos-guncelleme/main/updates/"
lines=open(key).read().split()
priv=Ed25519PrivateKey.from_private_bytes(base64.b64decode(lines[-1]))
data=open(exe,'rb').read()
name=os.path.basename(exe)
m={"product":"KayraPOS","channel":"stable","version":ver,
   "url":base+name,
   "sha256":hashlib.sha256(data).hexdigest(),"size":len(data),
   "notes":open(notes,encoding='utf-8-sig').read(),"date":datetime.date.today().isoformat()}
payload=json.dumps(m,ensure_ascii=False,separators=(',',':')).encode('utf-8')
env={"payload":base64.b64encode(payload).decode(),"signature":base64.b64encode(priv.sign(payload)).decode()}
open(out,'w').write(json.dumps(env,indent=1)+"\n")
print(m["version"],m["size"],m["sha256"])
