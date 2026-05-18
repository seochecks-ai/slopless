## Author: Jessy Li (ljunyi@seas.upenn.edu)

from collections import namedtuple, defaultdict
from numpy import mean, zeros

import utils

STOPWORDS = utils.readStopwords()

def sentLen(sentlst):
    return [t.getNumTokens() for t in sentlst]

def numCapLetters(sentlst, normalize):
    ret = []
    for t in sentlst:
        v = len([x for x in t.getStr() if x.isupper()])
        ret.append((v+0.0)/t.getNumTokens() if normalize else v)
    return ret

def numNumbers(sentlst, normalize):
    ret = []
    for t in sentlst:
        v = len([x for x in t.getTokens() if _is_num(x)])
        ret.append((v+0.0)/t.getNumTokens() if normalize else v)
    return ret

def numSymbols(sentlst, normalize):
    ret = []
    for t in sentlst:
        v = len([x for x in t.getStr() if not x.isalnum() and x!=" "])
        ret.append((v+0.0)/t.getNumTokens() if normalize else v)
    return ret

def avgWordLen(sentlst):
    ret = []
    for t in sentlst:
        v = [len(x) for x in t.getTokens()]
        ret.append(mean(v))
    return ret

def numConnectives(sentlst):
    conns = utils.readPdtbConns()
    ret = []
    for t in sentlst:
        v = len([x for x in t.getTokens() if x.lower() in conns])
        ret.append(v)
    return ret

def fracStopwords(sentlst):
    ret = []
    for t in sentlst:
        v = len([x for x in t.getTokens() if x.lower() in STOPWORDS])
        ret.append((v+0.0)/t.getNumTokens())
    return ret

def mpqaGenInqInfo(sentlst):
    mpqa = utils.readMpqa()
    geninq = utils.readGenInq()
    strongsubj = []; polar = []; pos = []; neg = []
    for t in sentlst:
        s = 0.0; p = 0.0; ps = 0.0; ng = 0.0
        for nodetxt in t.getTokens():
            txt = nodetxt.lower()
            if txt in mpqa:
                if mpqa[txt].subj == "strongsubj": s += 1
                if mpqa[txt].polarity != "neutral": p += 1
                if mpqa[txt].polarity == "negative": ng += 1
                if mpqa[txt].polarity == "positive": ps += 1
            elif txt in geninq:
                if geninq[txt][2] == 1: s += 1
                if geninq[txt][0]+geninq[txt][1] > 0: p += 1
                if geninq[txt][0] == 1: ps += 1
                if geninq[txt][1] == 1: ng += 1
        strongsubj.append(s/t.getNumTokens())
        polar.append(p/t.getNumTokens())
        pos.append(ps/t.getNumTokens())
        neg.append(ng/t.getNumTokens())
    return strongsubj,polar

def mrcInfo(sentlst):
    mrcdict = utils.readMrc()
    rs = []
    for t in sentlst:
        mrcinfoarr = zeros(4)
        for nodetxt in t.getTokens():
            txt = nodetxt.lower()
            if txt not in mrcdict: continue
            mrcinfoarr[0] += mrcdict[txt].fami
            mrcinfoarr[1] += mrcdict[txt].img
            mrcinfoarr[2] += mrcdict[txt].conc
            mrcinfoarr[3] += (mrcdict[txt].mcolo+mrcdict[txt].mpavlo)/2.0
        rs.append(mrcinfoarr/t.getNumTokens())
    return zip(*rs)

def idf(sentlst):
    idfd, idflowerd, default_oov = utils.readIdf()
    retmin = []; retmax = []; retavg = []
    for t in sentlst:
        idflst = []
        for x in t.getTokens():
            x = x.lower()
            if not x.isalpha() or x in STOPWORDS:
                continue
            idflst.append(idflowerd[x] if x in idflowerd else default_oov)
        if len(idflst) == 0: idflst.append(0)
        retmin.append(min(idflst))
        retmax.append(max(idflst))
        retavg.append(sum(idflst)/(len(idflst)+0.0))
    return retmin, retmax, retavg

def neuralvec(embeddings,sentlst):
    trainlst = []
    for t in sentlst:
        trainlst.append(getNeuralVec(t,embeddings)/t.getNumTokens())
    return zip(*trainlst)

def getNeuralVec(t,embeddings):
    vec = zeros(len(embeddings["*UNKNOWN*"]))
    txts = t.getTokens()
    for tok in txts:
        if tok not in embeddings:
            vec += embeddings["*UNKNOWN*"]
        else:
            vec += embeddings[tok]
    return vec

def getBrownClusNgram(t,n,brnclst):
    ls = []
    txts = t.getTokens()
    for nodetxt in txts:
        if nodetxt in brnclst:
            ls.append(brnclst[nodetxt])
        else: ## if not in cluster file, then use OOV symbol
            ls.append("UNK")
    return _sliding_window(ls, n)

def _is_num(s): ## s:string
    try:
        float(s)
        return True
    except ValueError:
        pass
    except TypeError:
        pass
    return False

def _sliding_window(l, n):
    return [tuple(l[i:i+n]) for i in range(len(l)-n+1)]


## categorical feature space
class Space:

    def __init__(self, startid):
        self.startid = startid
        self.freq = defaultdict(int)
        self.f_id = {}
        self.id_f = {}
        self.featselset = None

    def __repr__(self):
        s = "Feature Space Instance\n"
        s += "startid: "+str(self.startid)+" endid: "+str(self.getEndId())+"\n"
        s += "# entries: "+str(len(self.f_id))+"\n"
        if self.featselset!=None: s += "selected features: "+str(len(self.featselset))+"\n"
        return s

    def loadFromFile(self, filename):
        with open(filename) as f:
            minid = float("inf")
            for line in f:
                item,iid,freq = line.strip().split("\t")
                item = eval(item)
                if isinstance(item,tuple):
                    item = item[0]
                iid = int(iid)
                if minid > iid: minid = iid
                freq = int(freq)
                self.f_id[item] = iid
                self.freq[item] = freq
                self.id_f[iid] = item
        self.startid -= minid
        f.close()

    def add(self, lst): ## add a training instance, list of features
        for e in lst:
            if e not in self.f_id:
                i = len(self.f_id)
                self.f_id[e] = i
                self.freq[e] = 1
                self.id_f[i] = e
            else:
                self.freq[e] += 1

    def getEndId(self):
        return self.startid + len(self.f_id)

    ## given: raw feature list; produce: svmlight format: each entry format id:x
    def toFeatStr(self, lst, is_binary, minfreq = 3):
        s = defaultdict(int)
        for e in lst:
            if e not in self.f_id or self.freq[e]<minfreq or (self.featselset != None and e not in self.featselset): continue
            s[self.f_id[e]+self.startid] += 1
        ret = " ".join([str(e)+":1" for e in sorted(s)]) if is_binary else " ".join([str(e)+":"+str(v) for (e,v) in sorted(s.items())])
        return ret

    def toFeatDict(self, lst, is_binary, minfreq = 3):
        s = defaultdict(int)
        for e in lst:
            if e not in self.f_id or self.freq[e]<minfreq or (self.featselset != None and e not in self.featselset): continue
            s[self.f_id[e]+self.startid] += 1
        return s


## sentence object
class RawSent:

    def __init__(self, senttxt):
        ## tokenized sentence format
        self.tokens = senttxt.split()

    def getNumTokens(self):
        return len(self.tokens)

    def getTokens(self):
        return self.tokens

    def getStr(self):
        return " ".join(self.tokens)

    def __repr__(self):
        return self.getStr()
