---
layout: post
title: Automatic Evaluation of Healthcare LLMs Beyond Question-Answering
date: 2025-02-10
categories: aloe llm
summary:  We present a comprehensive, multi-axis suite for healthcare LLM evaluation, exploring correlations between open and close benchmarks and metrics
publisher: "<em>In: NAACL 2025</em>"
permalink: automatic-evaluation-llms
---

This paper has been accepted in NAACL 2025.

Check out the preprint in [arxiv](https://arxiv.org/abs/2502.06666).

## **Abstract**
Current Large Language Models (LLMs) benchmarks are often based on open-ended or close-ended QA evaluations, avoiding the requirement of human labor. Close-ended measurements evaluate the factuality of response but lack expressiveness. Open-ended capture the model’s capacity to produce discourse responses but are harder to assess for correctness. These two approaches are commonly used, either independently or together, though their relationship remains poorly understood. This work is focused on the healthcare domain, where both factuality and discourse matter greatly. It introduces a comprehensive, multi-axis suite for healthcare LLM evaluation, exploring correlations between open and close benchmarks and metrics. Findings include blind spots and overlaps in current methodologies. As an updated sanity check, we release a new medical benchmark —CareQA—, with both open and closed variants. Finally, we propose a novel metric for open-ended evaluations —Relaxed Perplexity— to mitigate the identified limitations.

<figure>
  <img src="/images/posts/automatic-evaluation-llm/tasks.png" alt="Tasks implemented." class="center-image">
  <figcaption>This table presents the tasks implemented in this paper. The first column specifies the different tasks. The
second details the metrics used (ROUGE includes ROUGE1, ROUGE2 and ROUGEL, and Perplexity includes Bits
per Byte, Byte Perplexity, and Word Perplexity). The third column outlines the benchmarks used for each task.</figcaption>
</figure>

<style>
    img.center-image {
        display: block;
        margin: 0 auto;
    }

    figcaption {
        text-align: center; 
        font-style: italic; 
        margin-top: 10px;
        font-size: 0.9em; 
    }
</style>


### **Authors**
Anna Arias-Duart, Pablo Agustin Martin-Torres, Daniel Hinjos, Pablo Bernabeu-Perez, Lucia Urcelay Ganzabal, Marta Gonzalez Mallo, Ashwin Kumar Gururajan, Enrique Lopez-Cuena, Sergio Alvarez-Napagao, Dario Garcia-Gasulla