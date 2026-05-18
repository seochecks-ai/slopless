## Author: Jessy Li (ljunyi@seas.upenn.edu)

## An interface for running on text files and lists of sentences

from nltk.tokenize import sent_tokenize, word_tokenize
from util.texthelper import cleanup
import speciteller

import argparse, os

def multisent_specificity(sentlst, per_sent=False):
    '''Specificity of more than one sentence is:
    first each word has specificity of its sentence
    then take the average word specificity.
    If per_sent is True then the per-sentence score is returned as a list.
    '''
    tkns = 0.0
    spec = 0.0
    if per_sent:
        per_sent_spec = []
    preds = speciteller.run("sents", sentlst)
    for (s, p) in zip(sentlst, preds):
        ntkn = float(len(s.split()))
        spec += p*ntkn
        tkns += ntkn
        if per_sent:
            per_sent_spec.append(p)
    if per_sent:
        return spec/tkns, per_sent_spec
    else:
        return spec/tkns

def run_text(inputfile, do_sent_tokenization, do_word_tokenization, per_sent, 
             cleanup_text = False):
    '''an interface for running an article
    '''
    prep = []
    with open(inputfile) as f:
        for line in f:
            line = line.strip()
            if len(line) > 0:
                if do_sent_tokenization:
                    prep.extend(sent_tokenize(line))
                else:
                    prep.append(line if not cleanup_text else cleanup(line))
    sents = []
    for prepsent in prep:
        if len(prepsent) > 0:
            if do_word_tokenization:
                sents.append(" ".join(word_tokenize(prepsent)))
            else:
                sents.append(prepsent)
    if len(sents) > 0:
        return multisent_specificity(sents, per_sent)
    else:
        return None, None

def run_dir(inputdir, outputdir, do_sent_tokenization, do_word_tokenization,
            cleanup_text = False):
    '''run speciteller on the entire directory; each file in it is a plain text file.
    output is named <input_file_name>.spec, one score per line, with document specificity
    on top. <doc/sentid>\tscore\n
    '''
    for filebase in os.listdir(inputdir):
        infile = os.path.join(inputdir, filebase)
        outfile = os.path.join(outputdir, filebase+".spec")
        if not os.path.exists(outfile):
            print "Processing "+infile
            allspec, sentspec = run_text(infile, do_sent_tokenization,
                                         do_word_tokenization, cleanup_text)
            if allspec is not None:
                with open(outfile, 'w') as f:
                    f.write("doc\t"+str(allspec)+"\n")
                    for i,sspec in enumerate(sentspec):
                        f.write(str(i)+"\t"+str(sspec)+"\n")

if __name__ == "__main__":
    # print run_text("/nlp/users/louis-nenkova/corpus-v2/BST-goodAvgBad-research/1999_01_03_1074147.txt", True, True)
    argparser = argparse.ArgumentParser()
    argparser.add_argument("--inputdir", required=True)
    argparser.add_argument("--outputdir", required=True)
    argparser.add_argument("--sent_tokenize", type=bool, default=False)
    argparser.add_argument("--word_tokenize", type=bool, default=False)
    argparser.add_argument("--cleanup", type=bool, default=False)
    args = argparser.parse_args()
    print args
    run_dir(args.inputdir, args.outputdir, args.sent_tokenize, args.word_tokenize, args.cleanup)

