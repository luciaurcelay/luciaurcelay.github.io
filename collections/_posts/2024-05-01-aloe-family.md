---
layout: post
title: Aloe, A Family of Fine-tuned Open Healthcare LLMs
date: 2024-05-01
categories: aloe llm
summary:  We introduce the Aloe family, a set of open medical LLMs highly competitive within its scale range
permalink: alow-fine-tuned-llms
---

Check out the preprint in [arxiv](https://arxiv.org/abs/2405.01886).

And for a more detailed blog post, check out [this page!](https://hpai.bsc.es/project-page/aloevera)

## **Abstract**
As the capabilities of Large Language Models (LLMs) in healthcare and medicine continue to advance, there is a growing need for competitive open-source models that can safeguard public interest. With the increasing availability of highly competitive open base models, the impact of continued pre-training is increasingly uncertain. In this work, we explore the role of instruct tuning, model merging, alignment, red teaming and advanced inference schemes, as means to improve current open models. To that end, we introduce the Aloe family, a set of open medical LLMs highly competitive within its scale range. Aloe models are trained on the current best base models (Mistral, LLaMA 3), using a new custom dataset which combines public data sources improved with synthetic Chain of Thought (CoT). Aloe models undergo an alignment phase, becoming one of the first few policy-aligned open healthcare LLM using Direct Preference Optimization, setting a new standard for ethical performance in healthcare LLMs. Model evaluation expands to include various bias and toxicity datasets, a dedicated red teaming effort, and a much-needed risk assessment for healthcare LLMs. Finally, to explore the limits of current LLMs in inference, we study several advanced prompt engineering strategies to boost performance across benchmarks, yielding state-of-the-art results for open healthcare 7B LLMs, unprecedented at this scale.

<figure>
  <img src="/images/posts/aloe-family/summary-alow-training-data.png" alt="Summary of Aloe training stages and data sources." class="center-image">
  <figcaption>Summary of Aloe training stages and data sources.</figcaption>
</figure>

<style>
    img.center-image {
        display: block;
        margin: 0 auto;
    }

    figcaption {
        text-align: center; /* Centers the description text */
        font-style: italic; /* Makes the description text italic (optional) */
        margin-top: 10px; /* Adds some space between the image and description */
        font-size: 0.9em; /* Adjusts the font size (optional) */
    }
</style>


### **Authors**
Ashwin Kumar Gururajan, Enrique Lopez-Cuena, Jordi Bayarri-Planas, Adrian Tormos, Daniel Hinjos, Pablo Bernabeu-Perez, Anna Arias-Duart, Pablo Agustin Martin-Torres, Lucia Urcelay-Ganzabal, Marta Gonzalez-Mallo, Sergio Alvarez-Napagao, Eduard Ayguadé-Parra, Ulises Cortés Dario Garcia-Gasulla