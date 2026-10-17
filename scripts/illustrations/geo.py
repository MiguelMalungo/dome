import math, itertools, collections
def icosa():
    p=(1+5**.5)/2
    V=[(-1,p,0),(1,p,0),(-1,-p,0),(1,-p,0),(0,-1,p),(0,1,p),(0,-1,-p),(0,1,-p),(p,0,-1),(p,0,1),(-p,0,-1),(-p,0,1)]
    F=[(0,11,5),(0,5,1),(0,1,7),(0,7,10),(0,10,11),(1,5,9),(5,11,4),(11,10,2),(10,7,6),(7,1,8),(3,9,4),(3,4,2),(3,2,6),(3,6,8),(3,8,9),(4,9,5),(2,4,11),(6,2,10),(8,6,7),(9,8,1)]
    return V,F
def norm(v):
    l=math.sqrt(sum(c*c for c in v));return tuple(c/l for c in v)
def rotate_vertex_up(V):
    # rotate so vertex 0 points +z
    a=norm(V[0]); z=(0,0,1)
    # rotation axis a x z
    ax=(a[1]*z[2]-a[2]*z[1],a[2]*z[0]-a[0]*z[2],a[0]*z[1]-a[1]*z[0]); s=math.sqrt(sum(c*c for c in ax)); c=sum(x*y for x,y in zip(a,z))
    k=tuple(x/s for x in ax); th=math.atan2(s,c)
    def R(v):
        kv=sum(x*y for x,y in zip(k,v)); cr=(k[1]*v[2]-k[2]*v[1],k[2]*v[0]-k[0]*v[2],k[0]*v[1]-k[1]*v[0])
        return tuple(v[i]*math.cos(th)+cr[i]*math.sin(th)+k[i]*kv*(1-math.cos(th)) for i in range(3))
    return [R(v) for v in V]
def geodesic(freq):
    V,F=icosa(); V=rotate_vertex_up([norm(v) for v in V])
    verts=[];idx={}
    def add(p):
        p=norm(p); key=tuple(round(c,6) for c in p)
        if key not in idx: idx[key]=len(verts); verts.append(p)
        return idx[key]
    faces=[]
    for a,b,c in F:
        A,B,C=V[a],V[b],V[c]
        grid={}
        for i in range(freq+1):
            for j in range(freq+1-i):
                k=freq-i-j
                p=tuple((A[t]*i+B[t]*j+C[t]*k)/freq for t in range(3))
                grid[(i,j)]=add(p)
        for i in range(freq):
            for j in range(freq-i):
                faces.append((grid[(i,j)],grid[(i+1,j)],grid[(i,j+1)]))
                if i+j<freq-1: faces.append((grid[(i+1,j)],grid[(i+1,j+1)],grid[(i,j+1)]))
    return verts,faces
if __name__=='__main__':
    for f in (3,4):
        v,fa=geodesic(f)
        zs=collections.Counter(round(p[2],3) for p in v)
        print(f, len(v), len(fa), sorted(zs.items(), reverse=True))
