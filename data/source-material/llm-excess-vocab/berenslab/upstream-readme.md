# Delving into LLM-assisted writing in biomedical publications through excess vocabulary

![Excess words in 2024](figures/words2024.png)

Analysis code for the paper [Kobak et al. 2025, Delving into LLM-assisted writing in biomedical publications through excess vocabulary](https://www.science.org/doi/full/10.1126/sciadv.adt3813).

How to cite:
```
@article{kobak2025delving,
  title={Delving into {LLM}-assisted writing in biomedical publications through excess vocabulary},
  author={Kobak, Dmitry and Gonz\'alez-M\'arquez, Rita and Horv\'at, Em\H{o}ke-\'Agnes and Lause, Jan},
  journal={Science Advances},
  year={2025},
  volume={11},
  number={27},
  pages={eadt3813},
}
```

Preprint version: https://arxiv.org/abs/2406.07016.

<p align="center"><img src="figures/examples.png" alt="Example excess words" width="400px"></p>

## Update: July 2025

Updated analysis using six more months of PubMed data compared to our published paper and computing monthly (rather than yearly) excess values:

<p align="center"><img src="figures/post-publication-updates/delving_2025_july.png" alt="Excess words in July 2025" width="500px"></p>

## Materials

* All 900 excess words that we identified from 2013 to 2024 are listed in `results/excess_words.csv` together with our annotations.
* The 362,442 × 15 matrix of yearly word occurrences (for each word and year, the number of abstracts in that year containing that word; the additional last row contains the total number of abstracts in that year) is available in `results/yearly-counts.csv.gz`. It allows to reproduce the main parts of our analysis.
* All figures from the paper are available in the `figures/` folder.

## Reproducibility instructions

1. All excess frequency analysis and all figures shown in the paper (and provided in the `figures/` folder) are produced by the `scripts/03-figures.ipynb` Python notebook (apart from Figure 7, which is produced by `scripts/08-figure-tsne.ipynb`). This notebook takes as input the `results/yearly-counts.csv.gz` file with yearly counts of each word and several other files with yearly counts of word groups (`yearly-counts*`). The notebook only takes a minute to run.
2. These yearly word count files are produced by the `scripts/02-preprocess-and-count.py` script which takes a few hours to run and needs a lot of memory. This script takes a dataframe with abstract texts as input, performs abstracts cleaning via regular expressions (~1 hour), then runs 
   ```Python
   vectorizer = sklearn.feature_extraction.text.CountVectorizer(
       binary=True,
       min_df=1e-6
   )
   vectorizer.fit_transform(df.AbstractText.values)
   ```
   (~0.5 hours), and then does yearly aggregation.
3. The input to the `scripts/02-preprocess-and-count.py` script is `pubmed_baseline_2025.parquet.gzip` containing PubMed data from the end-of-2024 snapshot. This is similar to files available at [the repository](https://zenodo.org/doi/10.5281/zenodo.7695389) associated with our _Patterns_ paper ["The landscape of biomedical research"](https://www.cell.com/patterns/fulltext/S2666-3899(24)00076-X), but corresponds to the newer PubMed snapshot. This file is constructed by the `scripts/01-process-baseline.ipynb` notebook that takes all XML files from https://ftp.ncbi.nlm.nih.gov/pubmed/baseline/ as input. These files have to be previously downloaded from the link above, unzipped, and stored in a directory, from which the `scripts/01-process-baseline.ipynb` notebook will read, combine, and save as a single dataframe (`pubmed_baseline_2025.parquet.gzip`).
4. The t-SNE figure produced by `scripts/08-figure-tsne.ipynb` takes `df_tsne_22_24.parquet.gzip` as input, which contains the t-SNE coordinates of the 2022-2024 papers as well as some metadata (class labels, country, inferred gender, and whether the paper is retracted or not). The t-SNE embedding is obtained as follows: the raw texts are first processed with a transformer (PubMedBERT) to obtain a numerical high-dimensional representation of each abstract (this is done in the file `04-obtain-BERT-embeddings.py`). Then, the high dimensional vectors are reduced to two dimensions with t-SNE (this is done in the file `05-obtain-tsne-embeddings.py`). After, the metadata is prepared (with the exception of the retractions) and saved with the 2D coordinates in `df_tsne_22_24.parquet.gzip` (this is done in the `06-generate-tsne-df.ipynb`).
5. In the notebook `07-analysis-retracted-papers.ipynb`, PMIDs from retracted papers are scraped from PubMed and combined with the ones available in the database Retraction Watch. Retracted papers are then ploted in the 2022-2024 t-SNE embedding. Additionally, a boolean flag of whether a paper is retracted or not is computed and added to the `df_tsne_22_24.parquet.gzip` dataframe.
