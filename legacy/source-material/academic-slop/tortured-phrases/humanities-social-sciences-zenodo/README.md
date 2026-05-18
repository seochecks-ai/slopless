# Tortured Phrases from the Humanities and Social Sciences - A fingerprints dataset

Authors: [Alexandre Clausse](https://orcid.org/0009-0004-7215-6247), [Fidan Badalova](https://orcid.org/0009-0005-3525-0717), [Guillaume Cabanac](https://orcid.org/0000-0003-3060-6241), [Philipp Mayr](https://orcid.org/0000-0002-6656-1658). Version: 13-JAN-2025.

## Presentation

[Tortured phrases](https://arxiv.org/abs/2107.06751) and [tortured abbreviations](https://hal.science/hal-04311600) are artifacts of spinners (e.g. [QuillBot](https://quillbot.com)), where established scientific terms are altered using synonyms, making them nonsensical regarding their field of study. As an example, the term "[bosom peril](https://thebulletin.org/2022/01/bosom-peril-is-not-breast-cancer-how-weird-computer-generated-phrases-help-researchers-find-scientific-publishing-fraud/)" is the tortured version of "breast cancer", being nonsensical in the cancer research area.

Nonsensical articles featuring such contents are [increasingly polluting the scientific literature](https://doi.org/10.1038/d41586-023-03464-x). To tackle this issue, a [post-publication peer-review](https://arxiv.org/abs/2210.15912) (PPPR) approach has been developped using the [Problematic Paper Screener](https://www.irit.fr/~Guillaume.Cabanac/problematic-paper-screener) (PPS) and [PubPeer](https://pubpeer.com/). It relies on domain experts to assess problematic articles and add new fingerprints to the PPS database, through a snowball effect. As the data are not normalized, and in order to capture each variant of a known tortured phrase, there is a need to improve the PPS algorithm.

However, most of these fingerprints are related to science, technology, engineering, and mathematics (STEM) studies. We proposed to extend this database by providing a dataset of 42 tortured phrases extracted from the PPS, and 121 tortured abbreviations generated with QuillBot, using genuine abbreviations from [ELSST](https://elsst.cessda.eu/) and [THESOZ](https://lod.gesis.org/thesoz/en/) thesauri. These are related to humanities and social sciences (HSS, e.g. 'bound-together domain' instead of 'United Kingdom'), precisely in education, psychology, and economics.

## Files

`20241114_social_sciences_fingerprints.csv`: the list of HSS tortured phrases extracted from the PPS.  
`Tortured_abbreviations.csv`: the list of tortured abbreviations generated with QuillBot, using genuine abbreviations from ELSST and THESOZ thesauri.

### Columns descriptions

`FINGERPRINT`: tortured phrases, and tortured abbreviations mismatching their abbreviation.  
`FINGERPRINT_NO_ABBR`: the same tortured phrases without their abbreviation (if any).  
`EXPECTED`: the genuine version of the tortured phrases and tortured abbreviations.

## How to cite this work

Clausse, A., Badalova, F., Cabanac, G., & Mayr, P. (2025). Tortured Phrases from the Humanities and Social Sciences - A fingerprints dataset. Zenodo. https://doi.org/10.5281/zenodo.14753785.