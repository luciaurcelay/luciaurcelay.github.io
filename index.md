---
layout: default
tags: home
---

# lucia urcelay ganzabal

## ml research scientist working on protein design

#### I work in the [AI for Protein Design](https://www.aiproteindesign.com/) research group, led by Noelia Ferruz, at the [Centre for Genomic Regulation (CRG)](https://www.crg.eu/). Our research explores the intersection of foundation models and protein design.

<!--
<figure>
  <img src="/images/protein_render.png" alt="3D protein." class="center-image">
</figure>

<style>
    img.center-image {
        display: block;
        margin: 0 auto;
        max-width: 65%;  /* Default width on larger screens */
        height: auto;
    }

    /* For mobile screens, let's make the image bigger */
    @media (max-width: 768px) {
        img.center-image {
            max-width: 100%;  /* Increase image size on mobile devices */
        }
    }
</style>
-->

<div id="molstar-container" style="width: 80%; height: 400px; margin: 0 auto; border-radius: 12px; overflow: hidden;"></div>

<link rel="stylesheet" href="{{ '/assets/molstar/molstar.css' | relative_url }}">
<script src="{{ '/assets/molstar/molstar.js' | relative_url }}"></script>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const viewer = new MolStar.Viewer('molstar-container', {
      layoutIsExpanded: true,
      layoutShowControls: false,
      layoutShowRemoteControls: false,
      layoutShowSequence: false,
      layoutShowLog: false,
      layoutShowLeftPanel: false,
      viewportShowExpand: false
    });

    viewer.loadStructureFromUrl('https://files.rcsb.org/download/1QYS.pdb', 'pdb');
  });
</script>



<p style="margin-top: 25px;">
  <a href="{{ site.baseurl }}/publications"><strong>see publications →</strong></a>  
  <br>  
  <a href="{{ site.baseurl }}/about"><strong>know more about me →</strong></a>  
</p>

<!--
[**See publications →**]({{ site.baseurl }}/publications)

[**Know more about me →**]({{ site.baseurl }}/about)
-->