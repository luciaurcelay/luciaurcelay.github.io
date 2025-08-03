---
layout: default
tags: home
---

# lucia urcelay

## ml research scientist working on protein design

#### I work in the [AI for Protein Design](https://www.aiproteindesign.com/) research group, led by Noelia Ferruz, at the [Centre for Genomic Regulation (CRG)](https://www.crg.eu/). Our research explores the intersection of foundation models and protein design.

<!-- Mol* CSS and JS -->
<link rel="stylesheet" href="{{ '/assets/molstar/molstar.css' | relative_url }}">
<script src="{{ '/assets/molstar/molstar.js' | relative_url }}"></script>

<!-- Viewer container -->
<div id="molstar-wrapper" style="display: flex; justify-content: center; margin: 2rem 0;">
  <div id="molstar-container"
       style="width: 400px; height: 300px; position: relative; border-radius: 8px; overflow: hidden;">
  </div>
</div>

<!-- Mol* Viewer Script -->
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const molstar = window.molstar;

    if (!molstar) {
      console.error("Mol* not loaded");
      return;
    }

    molstar.Viewer.create("molstar-container", {
      layoutIsExpanded: false,
      layoutShowControls: false,
      layoutShowSequence: false,
      layoutShowLeftPanel: false,
      viewportShowExpand: true,
      viewportShowSelectionMode: false,
    }).then(viewer => {
      viewer.loadPdb("6B68");
    });
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
