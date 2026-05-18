
# coding: utf-8

from collections import namedtuple
import os.path

import features
import utils

Instance = namedtuple("Instance","uid,label,rawsent")

class ModelNewText(object):

    def __init__(self, brnspace, brnclst, embeddings):
        self.featurestest = {} ## <name, flist>
        self.test = []
        self.brnclst = brnclst
        self.brnspace = brnspace
        self.embeddings = embeddings
        self.fileid = None

    def loadFromFile(self,filename):
        self.test = []
        self.fileid = os.path.basename(filename)
        i = 0
        with open(filename) as f:
            for line in f:
                if len(line.strip()) == 0: continue
                self.test.append(Instance(self.fileid+"."+str(i),0,features.RawSent(line.strip())))
                i += 1
        f.close()

    def loadSentences(self, identifier, sentlist):
        ## sentlist should be a list of sentence strings, tokenized;
        ## identifier is a string serving as the header of this sentlst
        self.test = []
        self.fileid = identifier
        for i,sent in enumerate(sentlist):
            self.test.append(Instance(identifier+"."+str(i),0,features.RawSent(sent)))
            
    def _add_feature(self, key, values):
        if key in self.featurestest: return
        self.featurestest[key] = values
    
    def fShallow(self):
        normalize = True
        recs = [r.rawsent for r in self.test]
        self._add_feature("sentlen",features.sentLen(recs))
        self._add_feature("numnumbers",features.numNumbers(recs, normalize))
        self._add_feature("numcapltrs",features.numCapLetters(recs, normalize))
        self._add_feature("numsymbols",features.numSymbols(recs, normalize))
        self._add_feature("avgwordlen",features.avgWordLen(recs))
        self._add_feature("numconns",features.numConnectives(recs))
        self._add_feature("fracstopwords",features.fracStopwords(recs))
        polarvals = features.mpqaGenInqInfo(recs)
        keys = ["mpqageninq-subj","mpqageninq-polarity"]
        for (key,vals) in zip(keys,polarvals):
            self._add_feature(key,vals)
        mrcvals = features.mrcInfo(recs)
        keys = ["mrc-fami","mrc-img"]
        for (key,vals) in zip(keys,mrcvals):
            self._add_feature(key,vals)
        idfvals = features.idf(recs)
        keys = ["idf-min", "idf-max", "idf-avg"]
        for (key,vals) in zip(keys,idfvals):
            self._add_feature(key,vals)
        
    def fNeuralVec(self):
        keys = ["neuralvec-"+str(i) for i in range(100)]
        if keys[0] not in self.featurestest:
            feats = features.neuralvec(self.embeddings,[r.rawsent for r in self.test])
            feats = list(feats)
            for i,key in enumerate(keys):
                self.featurestest[key] = feats[i]

    def fBrownCluster(self):
        if self.brnclst == None:
            self.brnclst = utils.readMetaOptimizeBrownCluster()
        key = "brnclst1gram"
        if key not in self.featurestest:
            self.featurestest[key] = []
            for instance in self.test:
                rs = features.getBrownClusNgram(instance.rawsent,1,self.brnclst)
                rs = ["_".join(x) for x in rs]
                self.featurestest[key].append(rs)

    def transformShallow(self):
        ys = [x.label for x in self.test]
        xs = [{} for i in range(len(self.test))]
        fnames = ["sentlen","numnumbers","numcapltrs","numsymbols","avgwordlen","numconns","fracstopwords","mpqageninq-subj","mpqageninq-polarity","mrc-fami","mrc-img","idf-min","idf-max","idf-avg"]
        for fid,fname in enumerate(fnames):
            for i,item in enumerate(self.featurestest[fname]):
                xs[i][fid+1] = item
        return ys,xs

    def transformWordRep(self):
        neuralvec_start = 1
        ys = [x.label for x in self.test]
        xs = [{} for i in range(len(self.test))]
        for j in range(100):
            fname = "neuralvec-"+str(j)
            for i,item in enumerate(self.featurestest[fname]):
                xs[i][j+1] = item
        for i,item in enumerate(self.featurestest["brnclst1gram"]):
            xs[i].update(self.brnspace.toFeatDict(item,False))
        return ys,xs




