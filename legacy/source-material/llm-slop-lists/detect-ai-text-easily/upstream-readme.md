[![Streamlit](https://img.shields.io/badge/Streamlit-Webapp-green)](https://ai-text-detect-easy.streamlit.app/) [![Blog](https://img.shields.io/badge/Blog-Link-orange)](https://levelup.gitconnected.com/detect-ai-text-by-just-looking-at-it-24604008027c) [![Code](https://img.shields.io/badge/Code-Link-blue)](https://github.com/FareedKhan-dev/Detect-AI-text-Easily/blob/main/code.py)  [![AI Words File](https://img.shields.io/badge/AI_Words-Link-yellow)](https://github.com/FareedKhan-dev/Detect-AI-text-Easily/blob/main/ai_words.txt)


## Detect AI Text by Just Looking at it

![Abstract of a Research Paper written using ChatGPT](https://cdn-images-1.medium.com/max/2448/1*fTV_vFjFWyhPSnWDauYOWw.png)

[ChatGPT](https://chat.openai.com/) often generates words that may require a dictionary for understanding, or it comes up with words that just sound magical. This isn’t only true for ChatGPT, other open-source language models like [Mistral](https://mistral.ai/news/announcing-mistral-7b/) do the same. There’s no harm in seeking assistance from AI to create content, as long as it’s done ethically, but in a [science-writing competition for 14–16 year-olds](https://www.bbc.com/future/article/20230720-how-to-spot-an-ai-cheater-artificial-intelligence-large-language-models#:~:text=%22Labyrinthian%20mazes%22.%20I%20don%27t%20know%20what%20exactly%20struck%20me%20about%20these%20two%20words%2C%20but%20they%20caused%20me%20to%20pause%20for%20a%20moment), a judge got suspicious when he saw the phrase **“Labyrinthian mazes”** in an essay, which seemed too advanced for a teenager writing. So, he used AI tools to check it. Unfortunately, all four tools gave the same result, almost the entire essay, around 90–96%, seemed to be written by AI, not a human. However, not all of us are professionals, If we see the above phrase, we may have skipped it due to our limited awareness.
> # There is a need for critical thinking skills to identify if AI is the author

The easiest way to spot AI-generated text is by checking for words that you don’t usually use but are common for ChatGPT. Consider a massive corpus of over [19 billion English words](https://www.english-corpora.org/now/) from blogs, articles, news, and more, updated daily from 2010 to now. I looked for the word **“delve” **using a string search algorithm, and it showed up **52,388 times**. I plot its yearly pattern and identified an unusual behavior, a **~200%** growth in its appearance on the internet from 2022, the same year when ChatGPT was released on November 30th.

![Trend of Delve word occurrence in [NOW](https://www.english-corpora.org/now/) Corpus (by Fareed Khan)](https://cdn-images-1.medium.com/max/3856/1*Tv76vgfG7kOF5IRudR5EIg.png)

Other words, like **“intricacies” **or **“unwavering”**, also shows a similar increase, just like **“delve”**. They’re being used more often lately.

![Trend of intricacies and unwavering in [NOW](https://www.english-corpora.org/now/) Corpus (by Fareed Khan)](https://cdn-images-1.medium.com/max/6512/1*EgrevS32vUy4eKx3F__oog.png)

This choice of vocabulary is not necessarily something that AI exclusively uses, as humans also use a diverse range of words. Although, in academic writing, we often use phrases like **“explore”** or **“discuss in more detail”** instead of **“delve”**. I ask ChatGPT to rephrase **“discuss in more detail …”**, ****the initial five suggestions it provides typically include this phrase.

![Rephrasing using ChatGPT](https://cdn-images-1.medium.com/max/7248/1*ypnIW51cEn7y5RqzJ0YrBw.png)

Moreover, I try to analyze the [arXiv database](https://www.kaggle.com/datasets/Cornell-University/arxiv), a famous publishing papers platform containing more than 2 million papers in it up to 2023. I try to detect the word** “delve” **in the papers abstracts and plot its yearly pattern. I was amazed to see that this word has been widely used in the papers abstracts in the year **2023**, the same word that ChatGPT suggested in its top 5 suggestions.

![Trend of Delve word occurrence in [arXiv Database](https://www.kaggle.com/datasets/Cornell-University/arxiv) (by Fareed Khan)](https://cdn-images-1.medium.com/max/3856/1*Ri6_R6bLQJ6TVSmj6JXvVg.png)

This indicates that academic writers may be using ChatGPT, either for rephrasing or generating content. The presence of the word **“delve”** serves as a hint or a doubt that the document submitted from a student or an online blog, either that paragraph or that portion of text, has been rephrased or enhanced using ChatGPT.

Drawing upon my research expertise and two years of experience working with LLMs, I’ve put together [a pretty comprehensive list of 100 words](https://github.com/FareedKhan-dev/Detect-AI-text-Easily/blob/main/ai_words.txt) you can keep an eye out for in a piece of text to help you figure out if it’s been generated or paraphrased using AI. 

But checking for such number of words is not an easy job so to achieve it quickly, I made a [web app](https://ai-text-detect-easy.streamlit.app/) that quickly checks your text. Just upload your file or paste your text, and it’ll do the rest. Easy peasy!

![](https://cdn-images-1.medium.com/max/4612/1*9R0i2dDcwrKXlZAqPNlvNw.png)

## Hope you enjoy the read!
