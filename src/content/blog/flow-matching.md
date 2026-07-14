date: 17/05/2026

# A Primer on Flow Matching

## Introduction

This post is a primer on the fundamentals of flow matching: the probability paths it builds, the velocity fields it learns, the loss it minimizes, and the algorithms that train and sample from it. We will work in two dimensions throughout so every idea has a picture next to it. A follow-up post will take these tools into protein design, where flow matching has become the new default for generating structures and binders.

## The generative modeling problem

A generative model has a single, slightly underwhelming job: given samples $x_1 \sim p_\text{data}$, produce more of them. We never observe $p_\text{data}$ — only finite samples from it — and the distribution itself is intractable to evaluate directly. Yet we want to sample from it on demand.

Modern generative models all share the same workaround. Instead of trying to learn $p_\text{data}$ itself, they learn a **transport**: a deterministic or stochastic map that takes a sample from a simple distribution $p_0$ (almost always $\mathcal{N}(0, I)$) and pushes it to a sample from $p_\text{data}$ — equivalently, a smooth family of intermediate densities

$$
p_t,\quad t \in [0, 1],\quad p_0 = \mathcal{N}(0, I),\quad p_1 \approx p_\text{data}.
$$

The trick is that the *path* between $p_0$ and $p_1$ is a design choice. Different choices give different models — diffusion, flow matching, stochastic interpolants, Schrödinger bridges. What they have in common is that, once you have committed to a path, generating a sample reduces to evolving an initial noise point along it.

<div id="fm-distribution-morph"></div>

Each dot above is a sample. At $t=0$ they are drawn from $\mathcal{N}(0, I)$; at $t=1$ they are drawn from a three-mode target. In between, the entire density of samples interpolates — particles do not appear or disappear, they *travel*. The job of a generative model is to learn the trajectories.

## Velocity fields and the continuity equation

If a sample is going to travel from noise to data, we need to say how. The cleanest description is a **velocity field**: a function $v_t(x)$ that, at every point in space and at every time $t$, tells a particle which way to move. A trajectory is then nothing more than the solution to an ordinary differential equation,

$$
\frac{dx_t}{dt} = v_t(x_t),\quad x_0 \sim p_0.
$$

Integrate from $t=0$ to $t=1$ and you have a sample of $p_1$.

This particle-level picture has a density-level twin, the **continuity equation**, which describes how the density $p_t$ evolves under transport by $v_t$:

$$
\frac{\partial p_t}{\partial t} = -\nabla_x \cdot (p_t \, v_t).
$$

In words: probability mass moves the way the velocity field says it does, and is conserved while it moves. The continuity equation is just the formal way of saying "particles travel under $v_t$, and probability is what they carry with them."

The two views are equivalent. The particle view is what you simulate when you sample. The density view is what tells you whether your samples will, in aggregate, land on the right distribution.

<div id="fm-velocity-field"></div>

Above, $v_t(x)$ is shown as a grid of arrows that change with $t$. Each arrow encodes a local rule for how a particle should move; sweeping $t$ shows how the same field looks at different stages of the flow. Mass is converging on the three modes of the target — but only because the entire field, evaluated everywhere and at every $t$, says so coherently. That coherence is what training will have to produce.

## Continuous normalizing flows: the prequel

The first attempts to use this picture for generative modeling appeared as **continuous normalizing flows (CNFs)** in the late 2010s. A CNF parameterizes $v_t$ with a neural network $v_\theta(x, t)$ and trains it by maximum likelihood. For any data point $x_1$, the log-density can be obtained by integrating an instantaneous change-of-variables formula along the reverse trajectory:

$$
\log p_1(x_1) = \log p_0(x_0) - \int_0^1 \bigl(\nabla_x \cdot v_\theta\bigr)(x_t, t) \, dt,
$$

where the divergence is evaluated along the reverse-ODE trajectory $t \mapsto x_t$ that starts at $x_1$ and ends at $x_0$. The objective is exact and the architecture is elegant. The training is unfortunately catastrophic at scale: every gradient step requires solving an ODE through the network, and every evaluation of $\log p_1$ requires a divergence — itself $\mathcal{O}(d)$ to compute exactly, or noisy to estimate with Hutchinson's trace. CNFs work, but the wall clock is brutal for anything beyond toy data.

The lesson is that the *parameterization* (a neural velocity field driving an ODE) is the right one. The *training objective* (likelihood) is not.

## Conditional probability paths

Flow matching's first idea is to swap the objective for something embarrassingly simple: regress $v_\theta(x_t, t)$ against a known target vector field $u_t(x_t)$ in $L^2$,

$$
\mathcal{L}_\text{FM}(\theta) = \mathbb{E}_{t,\,x_t}\bigl[\, \lVert v_\theta(x_t, t) - u_t(x_t) \rVert^2 \,\bigr].
$$

The problem is immediate: we do not actually know $u_t$. The marginal velocity field is exactly the object the model is supposed to figure out. If we could write it down analytically, we would not need a network.

The second idea is what makes flow matching tractable: although the **marginal** field is unknown, we can choose a **conditional** field $u_t(x_t \mid x_1)$ that we *can* write down. Condition on a single data point $x_1$ and design a tiny probability path

$$
p_t(\cdot \mid x_1)
$$

that interpolates from $p_0$ at $t=0$ to a Dirac at $x_1$ at $t=1$. Inside this conditional path, the velocity field is whatever we say it is, because *we built the path*. The promise — and we will see in a moment why it holds — is that training the network to match all of these conditional fields, one per data point, drives it to the same optimum as matching the unknown marginal field we wanted in the first place.

<div id="fm-conditional-paths"></div>

The colored cones above are the supports of three conditional paths, one per target. Inside each cone, every particle travels a known, simple trajectory toward its assigned $x_1$. Flow matching trains a single $v_\theta$ to fit all of those simple trajectories simultaneously. The marginal field — the one that respects all data at once — emerges from this fit, not by construction.

## Optimal transport paths

The conditional path is a design choice and a consequential one. The choice that almost everyone makes is **optimal transport (OT)**: among all transports from $p_0$ to a target Dirac at $x_1$, choose the one whose particles travel in straight lines at constant speed. This is McCann's displacement interpolation, and in the limit where the target has zero variance it reads

$$
x_t = (1-t)\, x_0 + t\, x_1,\quad x_0 \sim \mathcal{N}(0, I).
$$

Differentiating in time gives the conditional velocity field:

$$
u_t(x_t \mid x_1) = \frac{d x_t}{dt} = x_1 - x_0.
$$

It does not get simpler than that. The label is a single difference: end point minus start point. There is no variance schedule to tune, no SDE coefficients, no separate noise grid. And because each conditional path is a straight line at constant speed, the *marginal* trajectories — averaged over the data — tend to stay close to straight too, which translates directly into fewer ODE steps at inference. They are not literally straight: where conditional paths overlap, the marginal field bends, as the velocity-field animation already showed.

One caveat about the name, because it trips people up. The "optimal transport" here is a statement about the *conditional* path only — each individual path, from a noise sample to its assigned $x_1$, is the OT interpolation. It is emphatically **not** a claim that the trained model realizes the optimal transport map between $p_0$ and $p_\text{data}$. It does not, and it cannot: we draw $x_0$ and $x_1$ *independently*, so the coupling flow matching is trained against is the product of the two marginals — about as far from the OT coupling as a coupling can be. Straight conditional paths, crossing everywhere, produce a curved marginal field. Getting the *coupling* closer to optimal is a separate problem, and it is exactly what minibatch-OT flow matching and rectified flow are for — the latter we come to below.

OT paths are not the only choice. Diffusion-style "variance-preserving" and "variance-exploding" probability paths fit perfectly well into the flow matching framework; they just produce a curvier $v_t$ and need more steps to integrate. The dominant practical recipe is OT, and we will use it for the rest of this post. *(The animations below use a tiny but nonzero $\sigma_\text{target}^2$ to avoid numerical blow-up of the marginal field near $t = 1$; the conclusions are unchanged.)*

## The Conditional Flow Matching loss

Putting the two ideas together — conditional paths plus an $L^2$ objective — yields the loss that flow matching actually optimizes:

$$
\mathcal{L}_\text{CFM}(\theta) = \mathbb{E}_{t,\,x_1,\,x_0}\bigl[\, \lVert v_\theta(x_t, t) - (x_1 - x_0) \rVert^2 \,\bigr],
$$

with $t \sim \mathcal{U}[0, 1]$, $x_1 \sim p_\text{data}$, $x_0 \sim p_0$, and $x_t = (1-t) x_0 + t x_1$. Every term is known. There is no ODE to solve in training, no divergence to estimate, no importance weighting over noise levels. The model sees a triple $(x_t, t, x_1 - x_0)$ and learns to predict the third coordinate from the first two.

The reason this works is one of the prettier facts in the area. Consider a point $x_t$ that lies in the overlap of two conditional paths — heading toward $x_1$ in one and toward $x_1'$ in another. The model is asked to predict two different velocity labels at the same input. There is no parameter setting that satisfies both. So what does it do?

It minimizes squared error. The minimum-MSE estimate of two conflicting labels weighted by how often they occur is their conditional expectation. Once $(x_t, x_1)$ are fixed, the OT path pins down $x_0 = (x_t - t\,x_1)/(1-t)$, so the label simplifies to $x_1 - x_0 = (x_1 - x_t)/(1-t)$. Carrying this through, the optimum is

$$
v^\star(x_t, t) = \mathbb{E}_{x_1 \sim p_\text{data}(\,\cdot\, \mid x_t)}\!\left[\frac{x_1 - x_t}{1 - t}\right] = u_t(x_t),
$$

the *marginal* velocity field — exactly the object we were trying to learn but did not know how to write down. The conflict at the level of individual labels is precisely what produces the right answer at the level of expectations.

It is worth being careful about what exactly is equal here, since it is easy to overstate. $\mathcal{L}_\text{CFM}$ and $\mathcal{L}_\text{FM}$ are *not* the same number: the conditional loss keeps an irreducible variance term, because no function of $(x_t, t)$ can predict the individual label $x_1 - x_0$ once several data points could have produced the same $x_t$. What the two losses share is everything that depends on $\theta$. They differ by a constant the network cannot influence, so they have identical gradients and therefore the same minimizer. We cannot evaluate the objective we care about, but we can descend it — which is all training ever needed.

<div id="fm-marginal-averaging"></div>

The black arrow above is the marginal field at the probe; the colored arrows are the two conflicting conditional labels. As you drag the probe across the overlap, the marginal arrow tilts toward whichever target is more likely to have produced this $x_t$. The training loss does this tilt automatically through MSE.

## The training algorithm

The full training loop for OT-flow-matching fits in eight lines.

1. **Sample data.** Draw $x_1 \sim p_\text{data}$.
2. **Sample noise.** Draw $x_0 \sim \mathcal{N}(0, I)$.
3. **Sample time.** Draw $t \sim \mathcal{U}[0, 1]$.
4. **Interpolate.** Set $x_t = (1-t)\, x_0 + t\, x_1$.
5. **Compute the velocity label.** Set $u = x_1 - x_0$.
6. **Predict.** Evaluate $v_\theta(x_t, t)$.
7. **Loss.** Compute $\lVert v_\theta(x_t, t) - u \rVert^2$.
8. **Step.** Take a gradient step in $\theta$.

That is the whole thing. There is no buffer of noisy latents, no schedule of variances to anneal, no separate score head. The network sees a linear interpolation between a real data point and a Gaussian sample, asks itself which direction it should be moving, and is told. Iterate; the marginal field emerges.

A few small implementation notes are worth knowing. Large-scale models often replace the uniform $t \sim \mathcal{U}[0,1]$ with a distribution biased toward intermediate $t$ — Stable Diffusion 3 uses a logit-normal, for instance. The reason is *not* that the label is bigger there: in OT flow matching the label $x_1 - x_0$ does not depend on $t$ at all, so every time slice carries a label of the same expected magnitude. What changes with $t$ is the *difficulty* of the regression. Near $t = 0$ the input is almost pure noise and the best possible prediction is roughly $\mathbb{E}[x_1] - x_0$; near $t = 1$ the input almost determines $x_1$. Both ends are close to trivial, and the residual error is concentrated in the middle, so that is where extra samples buy the most. The network conditioning on $t$ is most often a sinusoidal embedding plus an MLP, as in diffusion models. And the architecture itself — UNet for images, transformer for protein structures or sequences — is essentially the same one that worked for score matching. Flow matching is a training recipe, not an architecture.

## Inference

Once the model is trained, sampling is a single line of pseudo-physics: drop a noise particle in the field and watch it flow.

$$
x_1 = x_0 + \int_0^1 v_\theta(x_t, t)\, dt,\quad x_0 \sim \mathcal{N}(0, I).
$$

In practice we approximate the integral. The cheapest approximation is forward Euler with $N$ steps,

$$
x_{t + \Delta t} = x_t + v_\theta(x_t, t)\, \Delta t,\quad \Delta t = 1/N,
$$

at the cost of one network evaluation per step. Higher-order solvers — Heun, RK4, adaptive methods — buy accuracy with more network calls per step. The headline trade-off is between **how curved the field is** and **how many steps you can afford**. A perfectly straight field requires one step. A field that loops and twists requires many.

<div id="fm-inference-trace"></div>

The animation above contrasts Euler integration with the underlying smooth flow. With five steps, the polyline cuts corners through curved regions and misses the target by a visible margin. With twenty it tracks the field closely. With a hundred it is indistinguishable from the continuous flow. The right number depends on the model — and on what you are willing to pay per sample.

## Rectified flow

The previous section hints at why anyone cares whether the field is straight: every bit of curvature costs steps, every step costs a network forward pass, and many real applications care about sample throughput. The natural next question is whether we can *make* the field straighter without changing the network or the objective.

**Rectified flow** is a remarkably clean answer. The curvature in a trained $v_\theta$ comes from the fact that the training pairs $(x_0, x_1)$ are sampled *independently*: a noise vector is not assigned to any particular data point, so during training, paths from different sources to different targets cross all over the place. The marginal field has to compromise between these crossings, and the compromises bend the trajectories.

The reflow procedure breaks that independence. After training a first model $v_\theta^{(1)}$, generate paired samples $(x_0, x_1)$ by sampling $x_0 \sim \mathcal{N}(0, I)$ and integrating the ODE under $v_\theta^{(1)}$ to obtain its $x_1$. Now retrain a new model $v_\theta^{(2)}$ on this coupling. The new pairs are aligned with whatever transport map the first model already learned, so far fewer of them cross. The retrained field is straighter. Sample again under it and a second reflow makes it straighter still.

<div id="fm-reflow-demo"></div>

The animation is a geometric stand-in for reflow on a small 2D coupling: rather than train a model and integrate it, it simply removes crossings from the segments directly, which is the effect reflow has. The initial independent coupling is a tangle. As the crossings come out, the transport untangles into a near-monotone matching whose straight-line paths barely interfere, and a flow like that can be integrated in a handful of Euler steps — sometimes one. Whether this is worth the cost of retraining depends on how often you plan to sample, but for large-scale image and protein models, rectified flow shows up everywhere.

## Flow matching vs. diffusion

It is worth being precise about the relationship to diffusion models, because they are mathematically closer than the marketing suggests.

A score-based diffusion model defines a stochastic process — typically variance-preserving or variance-exploding — and trains a network to predict the score $\nabla_x \log p_t(x)$ at each noise level. Sampling reverses the process, either as a stochastic differential equation or, deterministically, as the *probability-flow ODE*. The qualifier matters: reverse-SDE samplers produce the same marginals as the ODE but different particle trajectories. Once you commit to the probability-flow ODE, the only thing distinguishing a diffusion model from a flow-matching model is which target the network was trained to predict — score vs. velocity — and which probability path was used.

The two are connected by an explicit affine identity. For any Gaussian-conditional probability path $p_t(x \mid x_1) = \mathcal{N}(\alpha_t x_1, \sigma_t^2 I)$ — which covers OT, variance-preserving, and variance-exploding paths as special cases — the marginal velocity field can be written as

$$
v_t(x) = \frac{\dot\alpha_t}{\alpha_t}\,x \;+\; \left(\frac{\dot\alpha_t}{\alpha_t}\sigma_t^2 - \dot\sigma_t\, \sigma_t\right) \nabla_x \log p_t(x).
$$

For the OT schedule ($\alpha_t = t$, $\sigma_t = 1 - t$) we have $\dot\alpha_t / \alpha_t = 1/t$, and the score coefficient evaluates to $(1-t)^2/t + (1-t) = (1-t)/t$, so the identity collapses to

$$
v_t(x) = \frac{1}{t}\Bigl[\, x + (1 - t)\, \nabla_x \log p_t(x) \,\Bigr].
$$

The $1/t$ looks alarming, but the singularity is removable: at $t = 0$ we have $p_0 = \mathcal{N}(0, I)$, whose score is exactly $\nabla_x \log p_0(x) = -x$, so the bracket vanishes and the field stays finite. A score model is, up to a closed-form transformation, a velocity model — and vice versa.

What flow matching changes is the *training* path: straight, deterministic, with a closed-form $u_t$, no SDE-to-reverse-SDE bookkeeping, and a loss that does not need importance weighting across noise scales. Empirically this trains faster, scales better, and produces flatter trajectories that need fewer integration steps. Nothing about flow matching is *more expressive* than diffusion. It is a more efficient parameterization of the same idea.

## A brief look at applications

These mechanics are why flow matching has taken over so much of generative modeling in the last two years. The straight-line OT path is well-suited to high-dimensional structured outputs — pixels, voxels, protein backbones — because it does not impose extra curvature on top of whatever curvature the data demands. Stable Diffusion 3 and Flux switched to *(rectified)* flow matching for exactly this reason. So did **La-Proteina**, **Proteina-Complexa**, **RFDiffusion2**, and **PPIFlow** on the protein side, where the same conditional-path framework now handles backbones, all-atom structure, binder–target complexes, and active-site scaffolding. Despite the name, RFDiffusion2 trains with a flow-matching objective on SE(3) — diffusion in spirit, flow matching in practice. A future post will look at how those models adapt the recipe in this post — SE(3) equivariance, partially latent representations, motif conditioning — to the specifics of designing proteins. The math you have just walked through is the engine; structural biology is where the engine has been doing the most interesting work.

## Conclusion

Flow matching is, at its core, three ideas stacked on top of each other. Pick a probability path between noise and data that you can write down conditionally. Use the optimal-transport choice so that path is a straight line. Train a single velocity network by MSE against the difference $x_1 - x_0$, and trust the expectation to clean up the conflicting labels. Everything else — the ODE solver at inference, the reflow trick for straighter trajectories, the choice of architecture — is engineering on top of those three.

What you get is a generative model with the expressiveness of diffusion, the training simplicity of a regression, and sampling that costs less because the trajectories were straight to begin with. None of the individual pieces are new. The way they fit together is.

## References

1. Lipman, Y. et al. (2022). *Flow Matching for Generative Modeling*. arXiv:2210.02747. [https://arxiv.org/abs/2210.02747](https://arxiv.org/abs/2210.02747)
2. Liu, X., Gong, C., Liu, Q. (2022). *Flow Straight and Fast: Learning to Generate and Transfer Data with Rectified Flow*. arXiv:2209.03003. [https://arxiv.org/abs/2209.03003](https://arxiv.org/abs/2209.03003)
3. Albergo, M. S., Boffi, N. M., Vanden-Eijnden, E. (2023). *Stochastic Interpolants: A Unifying Framework for Flows and Diffusions*. arXiv:2303.08797. [https://arxiv.org/abs/2303.08797](https://arxiv.org/abs/2303.08797)
4. Tong, A. et al. (2024). *Improving and Generalizing Flow-Based Generative Models with Minibatch Optimal Transport*. TMLR. arXiv:2302.00482. [https://arxiv.org/abs/2302.00482](https://arxiv.org/abs/2302.00482)
5. Chen, R. T. Q. et al. (2018). *Neural Ordinary Differential Equations*. NeurIPS. [https://arxiv.org/abs/1806.07366](https://arxiv.org/abs/1806.07366)
6. Lipman, Y. et al. (2024). *Flow Matching Guide and Code*. Meta AI. [https://arxiv.org/abs/2412.06264](https://arxiv.org/abs/2412.06264)
7. Esser, P. et al. (2024). *Scaling Rectified Flow Transformers for High-Resolution Image Synthesis (Stable Diffusion 3)*. ICML. [https://arxiv.org/abs/2403.03206](https://arxiv.org/abs/2403.03206)
