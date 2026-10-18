"""Regenerates the dome illustrations in src/illustrations from real 3V 5/8 geodesic geometry.
Run: python3 scripts/illustrations/render.py  (no dependencies beyond Python 3)
"""
import math, random, sys, os
from geo import geodesic
OUT=sys.argv[1] if len(sys.argv)>1 else os.path.join(os.path.dirname(__file__),'../../src/illustrations'); os.makedirs(OUT, exist_ok=True)
V,FA=geodesic(3)
CUT=-0.2
F=[t for t in FA if all(V[i][2]>=CUT for i in t)]
# flatten base ring
V=[(x,y,max(z,-0.18)) if z<-0.15 else (x,y,z) for x,y,z in V]
def sub(a,b): return tuple(x-y for x,y in zip(a,b))
def dot(a,b): return sum(x*y for x,y in zip(a,b))
def cross(a,b): return (a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])
def nrm(a):
    l=math.sqrt(dot(a,a)); return tuple(x/l for x in a)
def cen(t): return tuple(sum(V[i][k] for i in t)/3 for k in range(3))
def fnorm(t):
    n=nrm(cross(sub(V[t[1]],V[t[0]]),sub(V[t[2]],V[t[0]])))
    return n if dot(n,cen(t))>0 else tuple(-x for x in n)
LIGHT=nrm((-0.55,-0.75,0.6))
class Cam:
    def __init__(s,az=18,el=11,scale=200):
        s.a=math.radians(az); s.e=math.radians(el); s.s=scale
        s.dir=(0,math.cos(s.e),-math.sin(s.e))
    def rot(s,p):
        x,y,z=p; c,si=math.cos(s.a),math.sin(s.a)
        return (x*c-y*si, x*si+y*c, z)
    def proj(s,p):
        x,y,z=s.rot(p)
        return (x*s.s, -(y*math.sin(s.e)+z*math.cos(s.e))*s.s, y*math.cos(s.e)-z*math.sin(s.e))
    def facing(s,t):
        n=s.rot(fnorm(t)); return dot(n,s.dir)<0
def pts(cam,t,off=(0,0,0)):
    return ' '.join('%.1f,%.1f'%cam.proj(tuple(a+b for a,b in zip(V[i],off)))[:2] for i in t)
def shade(t): return max(0.0,dot(fnorm(t),LIGHT))
def hexmix(h,f):
    h=h.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    if f<1: r,g,b=(int(c*f) for c in (r,g,b))
    else: r,g,b=(int(c+(255-c)*(f-1)) for c in (r,g,b))
    return '#%02x%02x%02x'%(min(r,255),min(g,255),min(b,255))
def depth(cam,t): return sum(cam.proj(V[i])[2] for i in t)/3
def azim(cam,t):
    x,y,z=cam.rot(cen(t)); return math.degrees(math.atan2(x,-y)), z
def ground(cam,rx=1.0,col='#1E3D34',op=0.10):
    cy=cam.proj((0,0,-0.18))[1]
    return f'<ellipse cx="0" cy="{cy+4:.1f}" rx="{rx*cam.s*1.12:.1f}" ry="{rx*cam.s*1.12*math.sin(cam.e)+6:.1f}" fill="{col}" opacity="{op}"/>'
def pine(x,base,h,col='#1E3D34'):
    w=h*0.42; s=''
    for k in range(3):
        top=base-h+k*h*0.22; bw=w*(0.55+0.22*k); bot=top+h*0.42
        s+=f'<path d="M{x:.1f} {top:.1f}L{x+bw:.1f} {bot:.1f}H{x-bw:.1f}Z" fill="{col}"/>'
    s+=f'<rect x="{x-h*0.03:.1f}" y="{base-h*0.12:.1f}" width="{h*0.06:.1f}" height="{h*0.12:.1f}" fill="{col}"/>'
    return s
def bbox(cam,extra=0.0):
    P=[cam.proj(V[i]) for t in F for i in t]
    xs=[p[0] for p in P]; ys=[p[1] for p in P]
    return min(xs),min(ys),max(xs),max(ys)
def svg(body,vb,label):
    x0,y0,w,h=vb
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.0f} {y0:.0f} {w:.0f} {h:.0f}" aria-hidden="true" focusable="false">{body}</svg>\n'
def faces_sorted(cam,front_only=True):
    L=[t for t in F if (cam.facing(t) or not front_only)]
    return sorted(L,key=lambda t:-depth(cam,t))
# ---------- hero: wood dome with glass triangles, landscape ----------
def windows(cam):
    W=set()
    for t in F:
        a,z=azim(cam,t)
        if cam.facing(t) and 0.05<z<0.62 and -42<a<28: W.add(t)
    # thin out: keep every other by index for rhythm
    W=sorted(W,key=lambda t:(round(azim(cam,t)[1],2),azim(cam,t)[0]))
    return set(W[::2])
def hero():
    cam=Cam(az=14,el=9,scale=200)
    win=windows(cam)
    b=''
    gy=cam.proj((0,0,-0.18))[1]
    b+=f'<defs><radialGradient id="hill" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#E2DFD2"/><stop offset="0.7" stop-color="#E2DFD2"/><stop offset="1" stop-color="#E2DFD2" stop-opacity="0"/></radialGradient></defs>'
    b+=f'<ellipse cx="0" cy="{gy+28:.0f}" rx="465" ry="52" fill="url(#hill)"/>'
    for x,h,c in ((-395,150,'#2E5446'),(-340,205,'#1E3D34'),(-282,128,'#2E5446'),(300,175,'#1E3D34'),(352,122,'#2E5446'),(405,200,'#1E3D34')):
        b+=pine(x,gy+14,h,c)
    b+=ground(cam)
    for t in faces_sorted(cam):
        s=shade(t)
        if t in win:
            fill=hexmix('#8FB3B0',0.78+0.35*s)
            b+=f'<polygon points="{pts(cam,t)}" fill="{fill}"/>'
            # glint
            b+=f'<polygon points="{pts(cam,t)}" fill="#ffffff" opacity="{0.06+0.18*s:.2f}"/>'
        else:
            b+=f'<polygon points="{pts(cam,t)}" fill="{hexmix("#C99A66",0.62+0.5*s)}"/>'
        b+=f'<polygon points="{pts(cam,t)}" fill="none" stroke="#5E3F25" stroke-width="2.2" stroke-linejoin="round"/>'
    # deck
    by=gy
    b+=f'<path d="M-95 {by+2:.0f} L95 {by+2:.0f} L120 {by+26:.0f} L-120 {by+26:.0f} Z" fill="#9C6B3F"/>'
    b+=f'<path d="M-120 {by+26:.0f} H120 V {by+33:.0f} H-120 Z" fill="#6E4A2C"/>'
    return svg(b,(-470,-250,940,400),'Ilustração de uma cúpula geodésica em madeira com janelas triangulares')
# ---------- covers ----------
def osb_pattern():
    random.seed(7); r=''
    for _ in range(140):
        x=random.uniform(0,80); y=random.uniform(0,80); w=random.uniform(4,13); h=random.uniform(1.4,3.2); a=random.uniform(0,180)
        c=random.choice(['#B98A55','#D8B07A','#A87947','#E3C08C','#C49564'])
        r+=f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{c}" transform="rotate({a:.0f} {x:.1f} {y:.1f})"/>'
    return f'<defs><pattern id="osb" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#CFA36E"/>{r}</pattern></defs>'
def cork_pattern():
    # expanded cork board: dark brown, coarse granules
    random.seed(11); r=''
    for _ in range(170):
        x=random.uniform(0,60); y=random.uniform(0,60); rad=random.uniform(1.0,3.2)
        c=random.choice(['#4A3020','#6E4A2C','#7A5534','#3E281A','#8A6440'])
        r+=f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rad:.1f}" fill="{c}"/>'
    return f'<defs><pattern id="cork" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#5E3F25"/>{r}</pattern></defs>'
def cover(kind):
    cam=Cam(az=14,el=12,scale=200)
    b=''
    if kind=='osb': b+=osb_pattern()
    if kind=='cork': b+=cork_pattern()
    b+=ground(cam)
    if kind=='glass':
        # interior: floor, plants, back frame
        cy=cam.proj((0,0,-0.18))[1]
        b+=f'<ellipse cx="0" cy="{cy:.1f}" rx="{cam.s*0.98:.1f}" ry="{cam.s*0.98*math.sin(cam.e):.1f}" fill="#B98A55"/>'
        for t in faces_sorted(cam,front_only=False):
            if not cam.facing(t):
                b+=f'<polygon points="{pts(cam,t)}" fill="#DCE8E4" fill-opacity="0.35" stroke="#8A5A33" stroke-opacity="0.45" stroke-width="2" stroke-linejoin="round"/>'
        for x,y,r in ((-80,cy-20,34),(-40,cy-8,26),(70,cy-16,30),(105,cy-4,22),(10,cy-30,18)):
            b+=f'<circle cx="{x}" cy="{y}" r="{r}" fill="#4F7A5A"/><circle cx="{x-r*0.3:.0f}" cy="{y-r*0.3:.0f}" r="{r*0.55:.0f}" fill="#6E9A72"/>'
        b+=f'<rect x="-36" y="{cy-34:.0f}" width="72" height="6" rx="2" fill="#7A5232"/><rect x="-30" y="{cy-28:.0f}" width="4" height="26" fill="#7A5232"/><rect x="26" y="{cy-28:.0f}" width="4" height="26" fill="#7A5232"/>'
    for t in faces_sorted(cam):
        s=shade(t); P=pts(cam,t)
        if kind=='osb':
            b+=f'<polygon points="{P}" fill="url(#osb)"/><polygon points="{P}" fill="#2a1a0c" opacity="{0.42-0.40*s:.2f}"/>'
            b+=f'<polygon points="{P}" fill="none" stroke="#7A5232" stroke-width="1.6" stroke-linejoin="round"/>'
        elif kind=='cork':
            b+=f'<polygon points="{P}" fill="url(#cork)"/><polygon points="{P}" fill="#1a0f07" opacity="{0.40-0.36*s:.2f}"/><polygon points="{P}" fill="#E3C08C" opacity="{0.10*s*s:.2f}"/>'
            b+=f'<polygon points="{P}" fill="none" stroke="#2E1D10" stroke-width="1.4" stroke-linejoin="round"/>'
        elif kind=='fabric':
            b+=f'<polygon points="{P}" fill="{hexmix("#EFEBE1",0.80+0.24*s)}"/>'
            b+=f'<polygon points="{P}" fill="none" stroke="#B9AE98" stroke-width="1.1" stroke-linejoin="round"/>'
        else:
            b+=f'<polygon points="{P}" fill="#BFD8D3" fill-opacity="{0.20+0.10*(1-s):.2f}"/><polygon points="{P}" fill="#ffffff" opacity="{0.05+0.22*s*s:.2f}"/>'
            b+=f'<polygon points="{P}" fill="none" stroke="#8A5A33" stroke-width="3" stroke-linejoin="round"/>'
    if kind=='fabric':
        cy=cam.proj((0,0,-0.18))[1]
        # door flap
        b+=f'<path d="M-26 {cy:.0f} V {cy-62:.0f} Q 0 {cy-84:.0f} 26 {cy-62:.0f} V {cy:.0f} Z" fill="#3E3428"/>'
    if kind in ('osb','cork'):
        cy=cam.proj((0,0,-0.18))[1]
        b+=f'<path d="M-24 {cy:.0f} V {cy-66:.0f} A 24 24 0 0 1 24 {cy-66:.0f} V {cy:.0f} Z" fill="#1E3D34"/><circle cx="14" cy="{cy-34:.0f}" r="2.5" fill="#D49A2A"/>'
    labels={'osb':'Cúpula revestida a OSB','fabric':'Cúpula revestida a tecido técnico','glass':'Cúpula envidraçada','cork':'Cúpula revestida a cortiça'}
    return svg(b,(-250,-262,500,500),labels[kind])
# ---------- partially built ----------
def build():
    cam=Cam(az=14,el=14,scale=200)
    b=ground(cam)
    zs=sorted(set(round(cen(t)[2],3) for t in F))
    done=[t for t in F if cen(t)[2]<0.36]
    # back first (inside visible since open), then front
    def dd(t): return -depth(cam,t)
    for t in sorted(done,key=dd):
        s=shade(t); P=pts(cam,t)
        if cam.facing(t):
            b+=f'<polygon points="{P}" fill="{hexmix("#C99A66",0.62+0.5*s)}" stroke="#5E3F25" stroke-width="2" stroke-linejoin="round"/>'
        else:
            b+=f'<polygon points="{P}" fill="{hexmix("#B98A55",0.72)}" stroke="#5E3F25" stroke-width="2" stroke-linejoin="round"/>'
    # ghost of the rest
    for t in F:
        if t in done: continue
        b+=f'<polygon points="{pts(cam,t)}" fill="none" stroke="#1E3D34" stroke-opacity="0.35" stroke-width="1.4" stroke-dasharray="5 6" stroke-linejoin="round"/>'
    # floating panel: pick a front face just above done line
    cand=[t for t in F if t not in done and cam.facing(t) and cen(t)[2]<0.62]
    t=min(cand,key=lambda t:abs(azim(cam,t)[0]+8)+abs(cen(t)[2]-0.45)*80)
    n=fnorm(t); off=tuple(c*0.32 for c in n)
    b+=f'<polygon points="{pts(cam,t,off)}" fill="{hexmix("#C99A66",1.08)}" stroke="#5E3F25" stroke-width="2.2" stroke-linejoin="round"/>'
    a=cam.proj(tuple(c+o*0.55 for c,o in zip(cen(t),off))); z=cam.proj(tuple(c+o*0.12 for c,o in zip(cen(t),off)))
    b+=f'<path d="M{a[0]:.1f} {a[1]:.1f} L{z[0]:.1f} {z[1]:.1f}" stroke="#D49A2A" stroke-width="3" stroke-linecap="round"/>'
    b+=f'<circle cx="{z[0]:.1f}" cy="{z[1]:.1f}" r="5" fill="#D49A2A"/>'
    return svg(b,(-250,-262,500,500),'Cúpula a meio da montagem, com um painel triangular a ser colocado')
def panel(kind):
    # kind A: sides .4035,.4124,.4124 ; B: .3486,.3486,.4035 ; base = .4035 for both
    if kind=='a': base,leg=0.4035,0.4124
    else: base,leg=0.4035,0.3486
    S=400; h=math.sqrt(leg**2-(base/2)**2)
    p=[(-base/2*S,0),(base/2*S,0),(0,-h*S)]
    P=' '.join('%.1f,%.1f'%q for q in p)
    b=f'<polygon points="{P}" fill="#D7B07C" stroke="#5E3F25" stroke-width="4" stroke-linejoin="round"/>'
    # inner frame
    cx=sum(q[0] for q in p)/3; cy=sum(q[1] for q in p)/3
    Q=' '.join('%.1f,%.1f'%(cx+(q[0]-cx)*0.78, cy+(q[1]-cy)*0.78) for q in p)
    b+=f'<polygon points="{Q}" fill="none" stroke="#5E3F25" stroke-opacity="0.35" stroke-width="2" stroke-linejoin="round"/>'
    return svg(b,(-0.24*S,-0.42*S,0.48*S,0.46*S),'Painel triangular tipo '+kind.upper())
def frame(kind):
    # the structure triangle under each panel: same outline, built as an open timber frame
    if kind=='a': base,leg=0.4035,0.4124
    else: base,leg=0.4035,0.3486
    S=400; h=math.sqrt(leg**2-(base/2)**2)
    p=[(-base/2*S,0),(base/2*S,0),(0,-h*S)]
    d=lambda u,v: math.hypot(u[0]-v[0],u[1]-v[1])
    la,lb,lc=d(p[1],p[2]),d(p[0],p[2]),d(p[0],p[1])
    ix=(la*p[0][0]+lb*p[1][0]+lc*p[2][0])/(la+lb+lc); iy=(la*p[0][1]+lb*p[1][1]+lc*p[2][1])/(la+lb+lc)
    r=base*S*h*S/(la+lb+lc)  # inradius
    k=(r-16)/r  # 16-unit timber members
    q=[(ix+(x-ix)*k, iy+(y-iy)*k) for x,y in p]
    ring='M'+' L'.join('%.1f %.1f'%v for v in p)+' Z M'+' L'.join('%.1f %.1f'%v for v in q)+' Z'
    b=f'<path d="{ring}" fill="#C99A66" fill-rule="evenodd" stroke="#5E3F25" stroke-width="4" stroke-linejoin="round"/>'
    for i in range(3):
        b+=f'<line x1="{p[i][0]:.1f}" y1="{p[i][1]:.1f}" x2="{q[i][0]:.1f}" y2="{q[i][1]:.1f}" stroke="#5E3F25" stroke-width="2.5" stroke-linecap="round"/>'
        m1=((p[i][0]+q[i][0])/2,(p[i][1]+q[i][1])/2); j=(i+1)%3; m2=((p[j][0]+q[j][0])/2,(p[j][1]+q[j][1])/2)
        b+=f'<line x1="{m1[0]:.1f}" y1="{m1[1]:.1f}" x2="{m2[0]:.1f}" y2="{m2[1]:.1f}" stroke="#5E3F25" stroke-opacity="0.22" stroke-width="1.5"/>'
    return svg(b,(-0.24*S,-0.42*S,0.48*S,0.46*S),'Triângulo de estrutura tipo '+kind.upper())
open(OUT+'/dome-hero.svg','w').write(hero())
for k in ('osb','fabric','glass','cork'): open(OUT+f'/dome-{k}.svg','w').write(cover(k))
open(OUT+'/dome-build.svg','w').write(build())
for k in 'ab': open(OUT+f'/panel-{k}.svg','w').write(panel(k))
for k in 'ab': open(OUT+f'/frame-{k}.svg','w').write(frame(k))
print('ok', len(F))
