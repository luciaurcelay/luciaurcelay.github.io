date: 27/03/2026

# Designing a Nanobody Against Nipah Virus: My Approach to the Adaptyv Bio Competition

## The Competition

Nipah virus (NiV) is a zoonotic paramyxovirus that spills over from fruit bats into humans, causing severe encephalitis and respiratory disease with **case fatality rates between 40 and 75%** depending on the outbreak <sup><a href="#references">1</a></sup>. The World Health Organization has listed it as a **priority pathogen** for research and development, in the same tier as Ebola and MERS, and there are currently no approved antivirals or vaccines for human use.

Adaptyv Bio recently organized an open design competition <sup><a href="#references">2</a></sup> centered on exactly this target. The challenge: design a high-affinity protein binder against the **Nipah virus Glycoprotein G (NiV-G)**, the viral surface protein responsible for docking to human cells. NiV-G achieves viral entry by binding to **Ephrin-B2** and **Ephrin-B3**, two receptors expressed prominently in the respiratory tract and central nervous system. A binder that occupies the Ephrin interface on NiV-G would sterically block viral attachment, making it a compelling **neutralization target** for therapeutic antibodies or diagnostic tools.

I entered the competition and built a two-stage computational pipeline combining a generative framework with a proprietary protein language model. My design ranked in the **top 13% in silico**, and then, like most designs in the competition, it did not show binding activity in the wet lab. That outcome is worth reflecting on honestly.

## A Primer on Antibodies and Nanobodies

Before getting into the design workflow, it is useful to understand what we are actually trying to build.

**Antibodies** (or immunoglobulins) are Y-shaped proteins produced by B cells as part of the adaptive immune response. Each arm of the Y contains a **variable domain**, a region that folds into a binding surface highly complementary to a specific molecular target. The tips of these variable domains contain three **complementarity-determining regions (CDRs)**, short loops that adopt diverse conformations and make direct contact with the antigen. This is where most of the specificity and affinity come from.

Conventional antibodies are composed of two heavy chains and two light chains. That architecture is effective but bulky, the full molecule sits around 150 kDa, which can limit access to hidden epitopes and complicate manufacturing.

Enter **nanobodies**. In camelid animals, llamas, camels, alpacas, a fraction of circulating antibodies naturally lack light chains entirely. These are called **heavy-chain-only antibodies (HCAbs)**, and their variable domains, known as **VHH domains** or nanobodies, are the smallest known functional antigen-binding units in nature: roughly 15 kDa, a single immunoglobulin fold, stabilized by an unusually long CDR3 loop that often protrudes to reach into grooves and cavities that conventional antibodies cannot access.

<figure style="margin: 1.5rem auto; max-width: 85%;">
  <img src="/nanobody_info.jpg" alt="Comparison of conventional antibody and nanobody structure" style="display: block; width: 100%; clip-path: inset(4px);" />
  <figcaption style="text-align: center; font-size: 0.8rem; opacity: 0.5; margin-top: 0.5rem;">Antibodies and variants <sup><a href="#references">6</a></sup></figcaption>
</figure>

This makes nanobodies particularly attractive as therapeutics and research tools <sup><a href="#references">3</a></sup>:

- **Size**: ~10× smaller than a full antibody, enabling tissue penetration and access to cryptic epitopes
- **Stability**: they withstand elevated temperatures and denaturing conditions better than conventional VH/VL heterodimers
- **Manufacturability**: they express efficiently in bacterial and yeast systems, making them cost-effective to produce
- **Engineering**: their single-domain nature makes them amenable to fusions, multimerization, and computational design

For viral neutralization, nanobodies have shown particular promise, several have been developed against SARS-CoV-2, influenza, and RSV. The Adaptyv competition targeted nanobodies specifically, with a constraint of ≤250 amino acids.

## My Approach

My pipeline had two sequential stages: **generative design** followed by **language-model-guided optimization**.

### Stage 1: Conditional Generation with Germinal

The first stage relied on **Germinal** <sup><a href="#references">4</a></sup>, a recently published generative framework for de novo protein design. Germinal enables **hotspot-conditioned generation**: you provide a set of target interface residues, and the model generates protein sequences designed to engage those specific positions.

The first step was structural analysis. I worked from the crystal structure of the **NiV-G–Ephrin-B2 complex** (PDB: 2VSM), which gives an atomic-resolution picture of how the virus docks to its receptor. From this structure, I extracted the binding interface residues, all positions on chain A (glycoprotein) within 5 Å of chain B (receptor), to identify which contact points on NiV-G are most critical for the interaction and, therefore, most desirable for a binder to engage.

I then tested multiple **hotspot combinations** to guide Germinal's conditional generation, producing approximately **200 de novo nanobody sequences** across runs. The hotspot set that delivered the most consistent performance was **A304, A305, A504, A558, and A579**, residues distributed across the Ephrin-binding face of the glycoprotein.

To select the best candidate for optimization, I evaluated each generated sequence across four structural and binding-relevant metrics:
- **ipSAE**: interface predicted Aligned Error, from Boltz2 structure predictions, lower is better
- **min-ipSAE**: minimum ipSAE across residue pairs at the interface
- **oDockQ**: a composite docking quality score
- **ipLDDT**: interface local distance difference test, measuring predicted structural accuracy at the binding site

The nanobody that ranked best across this combined panel was carried forward.

### Stage 2: Sequence Optimization with a Proprietary pLM

The second stage used a **proprietary protein language model (pLM)**, a transformer-based model fine-tuned on a curated dataset of approximately **100 nanobody sequences** characterized using the same in-silico metrics as above.

The logic is straightforward: a language model trained on a focused set of high-quality nanobody sequences learns a distribution over viable binding sequences. Positions that the model assigns **low log-likelihood** are, under this interpretation, outliers relative to the learned distribution, potentially suboptimal amino acids that do not fit what the model has learned constitutes a good nanobody.

The optimization strategy was simple but principled:
1. Run inference on the Stage 1 candidate
2. Identify the **10th percentile of residues by log-likelihood**, the positions the model is least confident about
3. Replace each of those residues with the **highest log-likelihood alternative** at that position given the model

This is a targeted, confidence-based substitution, conservative enough to preserve the overall fold and binding geometry, but nudging the sequence toward higher-likelihood territory in the learned distribution. The final submitted sequence was:

`QVQLVESGGGLVQGGGSVRGSSAASGKDAEEVFNKHSQQWDLRPEQGLEAVAAIASAGGGTLDGWWWWEWFTISRQASKNTLYLQGRSLGAEATAVYYCAAVRGYFMRLAIHRDGVVWGQGTLVTVSSRGR`

Below you can visualiza the generated nanobody (purple) in complex with NiV-G–Ephrin-B2 (green).

<div id="molstar-complex-placeholder"></div>

## From In Silico to In Vitro: A Reality Check

My design ranked in the **top 13% among all submissions** by in-silico metrics, a reasonable result for a two-stage pipeline without experimental feedback. But it did not bind in the wet-lab assay.

This is not unusual. It is, in fact, one of the central unsolved problems in computational protein design. The metrics we use, ipSAE, ipLDDT, pDockQ, are measures of **predicted structural plausibility**, not of actual binding affinity. A design can produce a confident-looking predicted complex that simply never materializes in solution, for reasons that range from the obvious to the subtle:

- **Conformational flexibility**: the crystal structure captures one frozen state; in solution, both the nanobody and the target sample an ensemble of conformations, and the contact geometry may differ
- **Entropic costs**: even a geometrically perfect interface may be thermodynamically unfavorable if forming it requires too much conformational restriction
- **Expression and folding**: a computationally valid sequence may not fold as predicted in a real expression system
- **Kinetic accessibility**: the predicted complex may be geometrically correct but hard to reach from the unbound state

There is also the question of **training data bias**. Both Germinal and the fine-tuned pLM are implicitly learning from existing nanobody sequences and structures, which are ultimately derived from immunized camelids or directed evolution campaigns. The distribution of de novo computationally designed nanobodies may sit in a different region of sequence space than what the experimental assay is sensitive to.

This gap between in silico and in vitro is narrowing, success rates in some recent computational campaigns have climbed to the 10–30% range, which is a real improvement over random sampling, but it remains the dominant challenge in the field. **Confidence in the model is not the same as confidence in the molecule.**

## Conclusion

This competition was a genuinely useful exercise. It forced me to think carefully about hotspot selection, about how to combine generative models with language-model refinement, and about how to build an evaluation pipeline that can rank candidates before a single experiment is run. The Germinal framework is elegant, the ability to steer generation toward specific interface residues is a meaningful advance over unconstrained diffusion or fixed-backbone design.

But the result is also an honest reminder that computational metrics are proxies, not ground truth. **Top 13% in silico, no binding in vitro.** The prediction problem and the design problem are related but distinct, and we are still in an era where the wet lab has the final word.

If I were to run this again, I would invest more in **diversity at the selection stage**, rather than committing to a single top-ranked candidate, submitting a panel of structurally diverse sequences covering multiple hotspot combinations would improve the odds that at least one makes it past the experimental filter. I would also be more skeptical of confidence metrics that are high because the model has seen similar structures before, rather than because the design itself is genuinely novel and stable. The virus does not care about your ipSAE score.


## References

	1.	WHO Blueprint Priority Diseases (2024). https://www.who.int/activities/prioritizing-diseases-for-research-and-development
	2.	Adaptyv Bio Nipah Virus Binder Design Competition (2025). https://proteinbase.com/competitions/adaptyv-nipah-competition
	3.	Muyldermans S. (2021). A guide to: generation and design of nanobodies. *FEBS Journal*, 288(7), 2084–2102. https://febs.onlinelibrary.wiley.com/doi/10.1111/febs.15515
	4.	Germinal: a generative framework for de novo protein binder design. bioRxiv (2025). https://www.biorxiv.org/content/10.1101/2025.09.19.677421v1
	5.	Lin Z. et al. (2023). Evolutionary-scale prediction of atomic-level protein structure with a language model. *Science*, 379, 1123–1130. https://doi.org/10.1126/science.ade2574
	6.	Nanobodies: determining neutralising antibodies after corona infection. Gesundheitsindustrie BW. https://www.gesundheitsindustrie-bw.de/en/article/news/nanobodies-determining-neutralising-antibodies-after-corona-infection
