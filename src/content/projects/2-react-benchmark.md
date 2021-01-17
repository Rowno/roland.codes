---
title: React Benchmark
socialImage: /assets/content/projects/react-benchmark/large@2x.png
twitterCard: summary_large_image
logos: [node]
links:
  - name: GitHub
    url: https://github.com/Rowno/react-benchmark
  - name: npm
    url: https://www.npmjs.com/package/react-benchmark
description: >
  A tool for benchmarking the render performance of React components.
---

A tool for benchmarking the render performance of React components.

React Benchmark works by building an optimised production bundle of the target component using Webpack and then benchmarking it in headless Google Chrome, so that the component is tested in a realistic environment. I built React Benchmark while optimising the render performance of [UI Box][] to quantify how well various improvements worked.

[ui box]: https://github.com/segmentio/ui-box
