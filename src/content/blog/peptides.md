date: 04/03/2026 

# On Peptidemaxing, Ozempification, Chinese Peptide Raves and ML for Peptide Design

## Introduction

This blog post was inspired by a conversation I had with my lab colleagues during last Christmas' dinner. One of them casually mentioned something about a **"Chinese peptide rave"** happening in San Francisco in December 2025, to which I responded: what is even that about?

The event went viral. Even **The New York Times** <sup><a href="#references">1</a></sup> covered it (https://www.nytimes.com/2026/01/03/business/chinese-peptides-silicon-valley.html). Pictures show a mix-your-own peptides workshop, a DJ spinning techno under projected chemical structures, and a dress code calling for "crazy futuristic cyberpunk attire."

But the aesthetic is just the surface. The NYT reports that, according to U.S. customs data, imports of hormone and peptide compounds from China roughly **doubled to $328 million** in the first three quarters of 2025, up from $164 million in the same period of 2024. This includes demand for **GLP-1 analogues**, **melanotan II**, and various other peptides supplied through compounding pharmacies and **gray-market channels**.

**Therapeutic peptides** are a distinct class of pharmaceutical agents composed of short chains of amino acids, typically 2 to ~50 residues, corresponding roughly to molecular weights of ~500–5,000 Da. Since the therapeutic use of **insulin** began in 1921, peptide drugs have steadily expanded in scope. As of 2024–2025, there are **over 80 approved peptide drugs** globally, spanning endocrinology, oncology, infectious disease, and metabolic disorders.

Following the classification proposed by **Dr. Eric Topol** <sup><a href="#references">2</a></sup> in his Substack piece on the peptide craze, I'll organize this post into two categories:
	1.	**FDA-approved peptides** that are now seeing widespread off-label or lifestyle use
	2.	**Peptides without FDA approval** circulating in research and gray-market ecosystems

Then, I'll shift gears and review the state of the art in **machine learning for peptide design**.


## FDA-Approved Peptides With Frequent Off-Label Use

The poster children of the current peptide era are **glucagon-like peptide-1 (GLP-1)**–based therapies such as **semaglutide** and **tirzepatide**. These drugs were initially developed for **type 2 diabetes** but have since reshaped obesity treatment and, arguably, body culture itself.

### How GLP-1 Drugs Work (Metabolically Speaking)

**GLP-1** is an **incretin hormone** naturally secreted by L-cells in the intestine in response to food intake. It acts through multiple coordinated mechanisms:
	•	**Pancreas**: Enhances glucose-dependent insulin secretion and suppresses glucagon release.
	•	**Stomach**: Slows gastric emptying, prolonging satiety.
	•	**Brain** (hypothalamus and brainstem): Reduces appetite and increases satiety signaling.
	•	**Peripheral tissues**: Improves insulin sensitivity indirectly through weight loss and metabolic effects.

Critically, **GLP-1 receptor agonists** only stimulate insulin release when glucose levels are elevated, reducing the risk of **hypoglycemia** compared to older diabetes drugs. Originally, these drugs were prescribed to improve glycemic control in type 2 diabetes. But during clinical trials, patients consistently lost significant weight. That observation, initially a "side effect", became the main event.

**Semaglutide** (approved as **Ozempic** for diabetes and later as **Wegovy** for obesity) and dual agonists like **tirzepatide** (which also targets **GIP receptors**) demonstrated substantial weight loss in randomized controlled trials—often **10–20% of body weight**, approaching the efficacy of surgery in some cases. Large cardiovascular outcome trials also showed reductions in **major adverse cardiovascular events** in high-risk populations <sup><a href="#references">3</a></sup>.

And that's when the cultural shift began. What started as **metabolic therapy** became **aesthetic therapy**. Which brings us to the broader ecosystem.

## Peptides Without FDA Approval

Unlike GLP-1 drugs, which are tightly regulated and clinically validated, many other peptides circulating online exist in a **regulatory gray zone**.

They can be purchased directly from overseas manufacturers, often labeled **"for research use only."** The label functions more as a legal shield than a biological one. Users self-inject, typically using insulin syringes. **Microdosing culture** has now merged with **peptide culture**.

I went on TikTok to see what people were saying about this. Unsurprisingly, I found hundreds of videos, mostly tech-adjacent biohackers and wellness influencers, describing **"cognitive-maxing"** and **"looks-maxing"** protocols involving injectable peptides. I spent a scientifically productive evening watching them.

Some of the most commonly mentioned compounds:
	•	**BPC-157** ("Body Protection Compound"): marketed for gut healing, muscle recovery, and neuroprotection.
	•	**Melanotan II** (MT-2): promoted for tanning effects and libido enhancement.
	•	**GHK-Cu**: a copper-binding peptide marketed for skin regeneration and anti-aging.

### What Does the Evidence Say?

For **BPC-157**, there are **no high-quality randomized controlled trials in humans** demonstrating safety or efficacy. Most data come from rodent models or small, non-rigorous human case series.

**Melanotan II** is not FDA-approved and has been associated in case reports with adverse effects including nausea, blood pressure changes, and potential **melanoma risk** concerns due to melanocortin receptor activation. It is not an approved tanning agent in the U.S.

**GHK-Cu** has some preclinical and small-scale dermatological research suggesting wound-healing and skin remodeling effects, but again, **no large-scale, FDA-reviewed efficacy trials** supporting systemic use.

In other words: **mechanistic plausibility is not the same as clinical validation**.

Importantly, BPC-157 is explicitly **prohibited by the World Anti-Doping Agency (WADA)** under the category of unapproved substances. WADA added it to the Prohibited List because it is not approved for human therapeutic use and lacks safety data. That alone should signal something.

So we now have:
	•	**FDA-approved peptides** transforming metabolic medicine
	•	**Non-approved peptides** circulating through biohacking networks
	•	A culture increasingly comfortable with **self-experimentation**

Which naturally raises the question: how are new peptides being designed in the first place?


## ML for Peptide Design

As an ML researcher, this whole landscape made me curious: what does the actual frontier of **computational peptide design** look like?

Peptide design is fundamentally a **constrained generative problem**: given a protein target (often with a shallow or "undruggable" interface), generate a short amino acid sequence that binds with high affinity, folds correctly, is stable, non-immunogenic, and manufacturable. That's a high-dimensional search space.

Recent work has shifted from sequence-only heuristics to **full-atom, multi-modal generative models** grounded in **geometric deep learning** and **diffusion or flow-based frameworks**. Here's a snapshot of some of the latest works.

What's interesting about the current generation of peptide design models is that they're converging on the same goal from very different angles: make something that not only looks like it should bind, but actually **survives experimental scrutiny**.

**RFpeptides** <sup><a href="#references">4</a></sup> is a good example of this maturation. Built on the **RoseTTAFold2** and diffusion lineage, it adapts those tools to design **macrocyclic peptides**, constrained rings that are often more stable and drug-like. By explicitly modeling cyclic geometry and generating structures through diffusion, the authors were able to design binders with measurable affinity across several targets. In multiple cases, **X-ray crystal structures closely matched the computational predictions**. That kind of structural validation matters: it suggests the model isn't just sampling plausible folds, but physically realizable ones.

Other groups are probing the edges of biology. **D-Flow** <sup><a href="#references">5</a></sup> focuses on fully **D-amino-acid peptides**, which are more resistant to degradation but notoriously hard to model because nature doesn't give us much data. By combining a **flow-based full-atom framework** with a **mirror-image strategy** and **protein language models**, it shows strong performance on benchmarks for D-peptide design.

Meanwhile, approaches like **PepEDiff** <sup><a href="#references">6</a></sup> question whether structure needs to be the central intermediate at all. Instead of building 3D models first, it generates binders directly in the **latent space of pretrained protein embeddings**, treating that manifold as a kind of semantic prior for binding. On challenging targets like **TIGIT**, this strategy appears competitive with structure-heavy pipelines.

At the same time, models such as **PepFlow** <sup><a href="#references">7</a></sup> and **SurfFlow** <sup><a href="#references">8</a></sup> double down on geometry—explicitly modeling backbone frames, side-chain angles, and even **molecular surfaces**. SurfFlow's emphasis on surface features feels almost obvious in hindsight: binding is a surface phenomenon, so ignoring surface properties was always a simplification.

And then there's **PeptiVerse** <sup><a href="#references">9</a></sup>, which doesn't generate peptides at all. It predicts **developability properties**—stability, solubility, and other drug-relevant traits—across both canonical sequences and chemically modified peptides. That's a quiet but important pivot. **Binding affinity is necessary, but it's nowhere near sufficient**.

Taken together, the field is moving from "can we design something that binds?" to **"can we design something that binds and behaves like a drug?"** That's a much harder problem, and a more interesting one.


## Conclusion

We are living in a strange peptide moment. On one side: rigorously tested **GLP-1 receptor agonists** transforming metabolic medicine and reshaping public health—and public aesthetics. On the other: a growing **gray market** of injectable peptides with limited human data, amplified by TikTok, podcasts, and techno-lit chemistry raves.

Meanwhile, in research labs and AI startups, **generative models** are learning to design macrocycles, D-peptides, surface-aware binders, and property-optimized therapeutics with **atomic precision**.

The real question isn't whether peptides are powerful. It's whether our **regulatory systems**, **clinical evidence pipelines**, and **collective risk tolerance** will keep pace with our ability to generate them.


## References

	1.	The New York Times (2026). Chinese Peptides and Silicon Valley Biohacking Culture. https://www.nytimes.com/2026/01/03/business/chinese-peptides-silicon-valley.html
	2.	Topol, E. (2025). The Peptide Craze. Ground Truths. https://erictopol.substack.com/p/the-peptide-craze
	3.	Nature Reviews Drug Discovery (2025). GLP-1 receptor agonists and cardiometabolic outcomes. https://www.nature.com/articles/s41573-025-01183-8
	4.	RFpeptides. Nature Chemical Biology (2024). https://www.nature.com/articles/s41589-025-01929-w
	5.	D-Flow. arXiv:2411.10618 (2025). https://arxiv.org/abs/2411.10618
	6.	PepEDiff. arXiv:2601.13327 (2026). https://arxiv.org/abs/2601.13327v1
	7.	PepFlow. arXiv:2406.00735 (2024). https://arxiv.org/abs/2406.00735
	8.	SurfFlow. arXiv:2601.04506 (2025). https://arxiv.org/abs/2601.04506
	9.	PeptiVerse. bioRxiv (2026). https://www.biorxiv.org/content/10.64898/2025.12.31.697180v1
