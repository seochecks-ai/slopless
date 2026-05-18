## Per-word features for other projects, not used in speciteller.
## Author: Jessy Li (jessy@austin.utexas.edu)

import utils

class PerwordFeatures(object):

    def __init__(self):
        self.stopwords = utils.readStopwords()
        self.connectives = utils.readPdtbConns()
        self.mpqa = utils.readMpqa()
        self.geninq = utils.readGenInq()
        self.mrcdict = utils.readMrc()
        self.idfd, self.idflowerd, self.default_oov = utils.readIdf()
        self.featnames = ["numchars", "iscap", # "hassymbol",
                          "isconn", "isstop", "subj",
                          "polar", "fami", "img",
                          "conc", "idf"]
        self.fnametoid = dict([(x,i) for i,x in enumerate(self.featnames)])

    def numFeatures(self):
        return len(self.featnames)

    def getDummyFeatureVec(self):
        return [0]*len(self.featnames)

    def binaryFeatureIds(self):
        return [self.fnametoid[name] for name in ["iscap","isconn","isstop","subj","polar"]]

    def wordToFeatureVec(self, word):
        ret = self.getDummyFeatureVec()
        ret[self.fnametoid["numchars"]] = len(word) if word.isalpha() else 1
        ret[self.fnametoid["iscap"]] = 1 if word[0].isupper() else 0
        # ret[self.fnametoid["hassymbol"]] = 0 if word.isalnum() else 1
        lw = word.lower()
        ret[self.fnametoid["isconn"]] = 1 if lw in self.connectives else 0
        ret[self.fnametoid["isstop"]] = 1 if lw in self.stopwords else 0
        if (lw in self.mpqa and self.mpqa[lw].subj == "strongsubj") or \
           (lw in self.geninq and self.geninq[lw][2] == 1):
            ret[self.fnametoid["subj"]] = 1
        if (lw in self.mpqa and self.mpqa[lw].polarity != "neutral") or \
           (lw in self.geninq and self.geninq[lw][0]+self.geninq[lw][1] > 0):
            ret[self.fnametoid["polar"]] = 1
        if lw in self.mrcdict:
            ret[self.fnametoid["fami"]] = self.mrcdict[lw].fami
            ret[self.fnametoid["img"]] = self.mrcdict[lw].img
            ret[self.fnametoid["conc"]] = self.mrcdict[lw].conc
        if word in self.idfd:
            ret[self.fnametoid["idf"]] = self.idfd[word]
        elif lw in self.idflowerd:
            ret[self.fnametoid["idf"]] = self.idflowerd[lw]
        else:
            ret[self.fnametoid["idf"]] = self.default_oov
        return ret

    # def set_hassymbol(self, vec, val):
    #     vec[self.fnametoid["hassymbol"]] = val

    def set_iscap(self, vec, val):
        vec[self.fnametoid["iscap"]] = val

    def set_numchars(self, vec, val):
        vec[self.fnametoid["numchars"]] = val


