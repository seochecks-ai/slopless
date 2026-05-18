# UPDATE:

**Please check out our new paper on accurately predict real-valued sentence specificity with no domain restrictions, presented at AAAI 2019:**

Wei-Jen Ko, Greg Durrett and Junyi Jessy Li, [Domain Agnostic Real-Valued Specificity Prediction](https://arxiv.org/abs/1811.05085), AAAI 2019

The new system is located in this repo: [https://github.com/wjko2/Domain-Agnostic-Sentence-Specificity-Prediction](https://github.com/wjko2/Domain-Agnostic-Sentence-Specificity-Prediction)

This system works well on non-news domains, such as Twitter, online reviews, and conversational data.

# SPECITELLER is a tool to predict sentence specificity.

The models in this package are obtained using co-training as described in Li and Nenkova, [Fast and Accurate Prediction of Sentence Specificity](http://www.seas.upenn.edu/~ljunyi/papers/specificity.pdf), AAAI 2015.

## Dependencies

Speciteller is implemented using Python 2.7. It depends on the following packages:

- numpy
- liblinear (in particular, `liblinearutil.py`; be sure you have a `liblinear.so.<x>` file in its `python/` directory. If not, type `make` in python/)

## Data and resources

Word lexicons for the models are available for download [here](http://www.cis.upenn.edu/~nlp/software/speciteller.html). Please note that these resources come with license(s). Decompress the tar ball under this (i.e., the speciteller) directory.

## Running Speciteller

Call:
```
$ python speciteller.py --inputfile inputfile --outputfile predfile
```

- `<inputfile>` should consists of *word-tokenized* sentences, one sentence per line;
- `<predfile>` will be the destination file which Speciteller will write the specificity scores to, one score per line in the same order as sentences in `<inputfile>`.
- An optional argument is `--write_all_preds`. When flagged this will generate two addtional files: `<predfile>.s` (prediction from the shallow model) and `<predfile>.w` (prediction from the word representation model).

For example:
```
$ python speciteller.py --inputfile sents_test --outputfile test.probs
```
This will give you specificity scores for the two sentences in `sents_test` in `test.probs`.

The scores range from 0 to 1, with 0 being most general and 1 being most specific.

## Practical notes
- It is best that you word-tokenize your sentences. If you don't, you will still get a score, but less good (~4% less accurate if you translate them into labels with a cutoff at 0.5).

- Note that the word embedding file is a compressed ~190mb .gz file. Each run of speciteller.py will load the file to generate features. Thus it is best to avoid loading it multiple times, or modify predict.py and tailor it for your data loading purpose.

## Citation and contact

Please cite the following paper:

Junyi Jessy Li and Ani Nenkova. 2015. [Fast and Accurate Prediction of Sentence Specificity](http://www.seas.upenn.edu/~ljunyi/papers/specificity.pdf). Twenty-Ninth Conference on Artificial Intelligence (AAAI). \[[bibtex](http://www.seas.upenn.edu/~ljunyi/papers/specificity.bib)\]

Please send comments and feedback to [Jessy Li](mailto:ljunyi@seas.upenn.edu).
