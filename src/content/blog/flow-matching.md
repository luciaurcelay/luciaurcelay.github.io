date: 13/04/2026

# A Primer on Flow Matching for Protein Design

## Introduction

If you have been following the protein design literature over the past year, you have probably noticed a quiet but decisive shift. Models that used to be described as diffusion-based are now described as flow-matching-based. The titles changed, the benchmarks improved, and a handful of genuinely new architectures appeared. What actually changed, and why does it matter?

This post is a technical introduction to **flow matching** and its application to protein structure and sequence design. I will start from the mathematical foundations, explain how flow matching differs from diffusion, then walk through some of the most important models that have emerged from this paradigm: **La-Proteina**, **Proteina-Complexa**, **RFDiffusion2**, and **PPIFlow**.

## What is Flow Matching?

To understand flow matching, it helps to start one level up, with **continuous normalizing flows (CNFs)**.

A continuous normalizing flow is a generative model that transforms a simple source distribution, typically a Gaussian, into a complex target distribution (your data) via a continuously defined trajectory. Instead of a discrete sequence of transformation steps, a CNF defines a **velocity field** v_θ(x, t) that tells you, at every point in space and time, in which direction to move. You generate a sample by integrating an ordinary differential equation:

```
dx/dt = v_θ(x(t), t),   x(0) ~ N(0, I)
```

Integrate from t = 0 to t = 1, and you get a sample from the learned data distribution.

The problem with traditional CNFs is training: computing the likelihood requires solving the ODE during each gradient step, which is expensive. **Flow matching** <sup><a href="#references">1</a></sup> solves this with a much simpler idea. Instead of training by maximum likelihood, you directly **regress the velocity field** against a target vector field that you can compute analytically:

```
L = E[ ‖v_θ(x(t), t) − u_t(x(t) | x₁)‖² ]
```

where x₁ is a data sample and u_t is the conditional vector field pointing from the noisy sample toward x₁ at time t. This is **simulation-free**: no ODE solving during training, just straightforward regression. The result is a model that learns to transport noise to data along smooth, efficient trajectories.

### Optimal Transport Paths

A key design choice in flow matching is how to define the **probability path**, the interpolation between noise and data. The most principled choice is the **optimal transport (OT) path**, which corresponds to straight-line interpolation:

```
x(t) = (1 − t)·x₀ + t·x₁,   x₀ ~ N(0, I)
```

Straight-line paths are optimal in the Wasserstein sense: they minimize the kinetic energy of the transport, and crucially, **they do not cross**. This last property has a practical consequence: the velocity field has lower variance and is easier to learn, which translates to better sample quality with far fewer integration steps.

### Flow Matching vs. Diffusion

Diffusion models, score-based generative models trained via denoising score matching, have been the dominant paradigm for structural biology applications since RFDiffusion in 2022. The comparison with flow matching is worth being precise about.

Both frameworks learn to transform noise into data. The differences are architectural and operational:

- **Training dynamics**: diffusion requires estimating a score function ∇ log p_t(x) at each noise level; flow matching regresses a velocity field directly. Flow matching's objective has lower variance and does not require importance weighting over noise levels.
- **Sampling paths**: diffusion models follow stochastic trajectories (Langevin dynamics or reverse SDEs), even in their ODE-based variants. OT-based flow matching uses straight, deterministic paths. Fewer steps needed, typically 10–20 ODE evaluations versus 50+ for diffusion.
- **Scalability**: the simulation-free training objective and efficient sampling of flow matching make it substantially more tractable at the scale of full proteins. This is not a minor efficiency gain; it is what enables designs up to 800 residues where diffusion baselines start failing.

Mathematically, score-based diffusion and Gaussian-source flow matching are equivalent in the limit, they both define probability paths over the same space. Flow matching is better understood as a **more efficient parameterization** of the same underlying generative process, with a training objective that happens to work much better in practice for high-dimensional structured data.

## Why Proteins Are Hard

Before getting into the models, it is worth stating clearly why protein design is a particularly challenging generative modeling problem.

A protein is not just a sequence, and it is not just a structure, it is both simultaneously, coupled through the physics of folding. A generative model for protein design has to navigate several intertwined challenges:

- **Mixed modalities**: the output includes a discrete sequence (20 amino acid types) and continuous 3D coordinates (backbone angles, side-chain positions), which live in very different mathematical spaces
- **SE(3) symmetry**: the representation must be equivariant to rotations and translations, the same protein looks the same regardless of how it is oriented in space
- **Hierarchy of constraints**: local geometry (bond lengths, angles, Ramachandran), secondary structure, global fold, and binding interface geometry all have to be simultaneously satisfied
- **Sparse experimental feedback**: most designed sequences are never synthesized, let alone experimentally characterized, making it hard to close the loop between model predictions and ground truth

Flow matching addresses the first three challenges more elegantly than diffusion because its continuous, deterministic paths are easier to condition on auxiliary information (existing structure, binding site, functional motif) and because the OT interpolation aligns naturally with the physical intuition that a protein is folded by a continuous, energy-minimizing process.

## State of the Art Models

### La-Proteina

**La-Proteina** <sup><a href="#references">2</a></sup> (NVIDIA Research / University of Oxford, 2025) is the first model in this family and sets up the architecture that the rest build on.

The core idea is a **partially latent representation**. Rather than generating all-atom structures directly in coordinate space (expensive, high-dimensional) or working only with backbone Cα traces (losing side-chain information), La-Proteina splits the representation:
- **Backbone Cα coordinates** are kept in explicit 3D space and generated via flow matching
- **Amino acid identity and side-chain conformations** are encoded into per-residue latent vectors using a VAE, and generated jointly in latent space

This partial latency keeps the dimensionality of the generation problem manageable while preserving full-atom accuracy. The flow matching objective operates simultaneously over backbone coordinates and sequence latents, learning a joint distribution over structure and sequence.

The practical result is striking: La-Proteina generates proteins up to **800 residues** with competitive all-atom co-designability metrics, in a regime where previous diffusion-based baselines collapse. It also supports motif scaffolding, conditioning on a functional motif and generating the surrounding structure, a key task for therapeutic protein engineering.

### Proteina-Complexa

**Proteina-Complexa** <sup><a href="#references">3</a></sup> (NVIDIA Research, 2026, ICLR oral) extends the La-Proteina framework to **binder-target complexes**, arguably the most industrially relevant application of generative protein design.

The extension is non-trivial. Designing a binder requires the model to reason about interactions between two protein chains simultaneously, which demands pairwise geometric and chemical awareness. Proteina-Complexa adds a **pairformer module**, an attention architecture that explicitly constructs and refines pairwise representations between binder and target residues, and integrates test-time compute optimization to further improve binding predictions after generation.

The training data story is also notable. The authors construct **Teddymer**, a large-scale synthetic dataset of binder-target pairs, to pretrain the model before fine-tuning on experimentally characterized binders. This addresses the fundamental data scarcity problem: high-quality experimental binding data is limited, but plausible structural pairings can be generated computationally and used for pretraining.

The experimental validation is the most extensive published for any generative binder design model: in collaboration with Manifold Bio, the team tested approximately **one million designs across 127 targets** using multiplexed phage display. The result was binding activity against **68% of targets**, a success rate that represents a genuine step change relative to prior methods.

### RFDiffusion2

**RFDiffusion2** <sup><a href="#references">4</a></sup> (Baker Lab / MIT, Nature Methods 2026) takes a different focus: **enzyme active site scaffolding**, the task of designing a protein that positions a small set of catalytic residues in precise geometric arrangements required for a chemical reaction.

This is a particularly challenging conditioning problem. Enzyme design requires matching atomic-level functional group constraints, not just which residues to include, but which rotamer conformations they adopt, and how the surrounding scaffold supports them. Previous RFDiffusion-based approaches required users to specify residue indices and rotamer conformations explicitly, which demanded deep structural knowledge and severely limited the search space.

RFDiffusion2 removes this requirement. It operates on **atom-level functional group specifications** and infers both rotamer conformations and residue identities as part of the generation process. Critically, it is **trained with flow matching** rather than the original diffusion objective, which the authors found to give superior training stability and generation efficiency at the atomic level, a finding consistent with the general pattern in the field.

The benchmark results are clear: RFDiffusion2 successfully scaffolds all 41 active sites in a diverse benchmark, compared to 16 for the previous method. Three proof-of-concept designs were experimentally validated, with active catalytic variants found in each case using fewer than 96 sequences per target.

### PPIFlow

**PPIFlow** <sup><a href="#references">5</a></sup> (bioRxiv 2026) is focused specifically on **protein-protein interaction (PPI) design**, with an emphasis on high-affinity binder engineering and antibody design.

The model uses **SE(3) flow matching** over rigid-body backbone frames, the standard approach for equivariant protein generation, where each residue is represented as a rotation and translation in 3D space. The velocity field is parameterized by a pairformer that reasons over both intra-chain and inter-chain residue pairs.

PPIFlow's most interesting methodological contribution is **partial flow for affinity maturation**. Given a binder-target complex, you can fix the interface residues you want to preserve, perturb the remaining backbone to an intermediate time point on the flow trajectory, and then regenerate the perturbed region conditioned on the fixed interface. This is effectively a principled computational analog of directed evolution: iterate generation around a known scaffold to improve binding while preserving the core interaction geometry. The same procedure works for antibody design by fixing the CDR loops and regenerating the framework.

## The Remaining Challenges

Flow matching has solved some problems in protein design more cleanly than diffusion. It has not solved the field.

The most persistent challenge remains the **gap between computational metrics and experimental activity**. Models like Proteina-Complexa are evaluated on ipTM, pDockQ, and interface pLDDT, confidence metrics from structure prediction models. These correlate with binding, but imperfectly. The Proteina-Complexa 68% target hit rate is impressive relative to previous methods, but it also means that roughly one in three targets produced no binders despite a million designs, and the million-design scale is not accessible to most practitioners.

A second challenge is **functional specificity**. Flow matching models are getting very good at generating structurally plausible binders. Getting them to bind the right epitope, avoid off-target interactions, maintain selectivity across closely related homologs, and retain activity in physiological conditions, these require conditioning signals and evaluation pipelines that go well beyond structure prediction.

Finally, there is the question of **sequence space coverage**. Flow matching models learn from existing structures. The PDB is vast but biased, toward stable, well-folded, soluble, evolutionarily conserved proteins. De novo designs that fall outside this distribution may be geometrically valid by all computational metrics and still fail to fold as predicted in a real expression system. Closing this gap requires more experimental data, better feedback loops between computation and experiment, and probably generative models that are better calibrated about the uncertainty in their own predictions.

## Conclusion

Flow matching has earned its place as the new standard for generative protein design. Its mathematical properties, straight-line OT paths, simulation-free training, deterministic sampling, translate directly into practical advantages: faster training, fewer inference steps, and better scaling to large structures and complexes.

The models built on this foundation, La-Proteina, Proteina-Complexa, RFDiffusion2, PPIFlow, are not incremental updates. They represent a qualitative expansion in what computational protein design can attempt: full-atom all-at-once generation, million-scale binder campaigns, atomic-level enzyme scaffolding, and principled affinity maturation. The benchmark numbers are better than anything we had two years ago.

But the hardest part of the problem has not changed. A model that generates a confident-looking binder structure is not the same as a model that generates a binder. The gap between in silico and in vitro remains the dominant challenge, and the models that close it will not just be better at generating structures. They will be better at knowing when to trust themselves.


## References

	1.	Lipman Y. et al. (2022). Flow Matching for Generative Modeling. arXiv:2210.02747. https://arxiv.org/abs/2210.02747
	2.	La-Proteina: Atomistic Protein Generation via Partially Latent Flow Matching. arXiv:2507.09466 (2025). https://arxiv.org/abs/2507.09466
	3.	Proteina-Complexa: Scaling Atomistic Protein Binder Design with Generative Pretraining and Test-Time Compute. arXiv:2603.27950 (2026). https://arxiv.org/abs/2603.27950
	4.	Atom-level enzyme active site scaffolding using RFdiffusion2. *Nature Methods* (2026). https://www.nature.com/articles/s41592-025-02975-x
	5.	PPIFlow: High-Affinity Protein Binder Design via Flow Matching and In Silico Maturation. bioRxiv (2026). https://github.com/Mingchenchen/PPIFlow
