+++
title = "Procedural City Generation"
codelink = "https://github.com/t-mw/citygen"
js = ["pixi-1.6.0", "lodash-2.4.1", "react-0.11.1", "city_generation"]
css = "city_generation"
type = "article"
+++

Click and hold to navigate. Click on two locations to find a path.

<div id="pixiContainer" aria-label="JavaScript demo"></div>

Since seeing the city generation from the shelved Introversion Software game "Subversion" [in action](https://www.youtube.com/watch?v=J30i0gABfS8), I've wanted to to try writing a basic procedural city generator myself. The developers followed a method described in [Parish and Müller's paper: Procedural Modelling of Cities (2001)](https://graphics.ethz.ch/Downloads/Publications/Papers/2001/p_Par01.pdf). The paper is well-written and accessible, however the rules defined for the algorithm (defined as an [L-system](https://en.wikipedia.org/wiki/L-system)) are hard to interpret for a layperson and, as argued [here](http://nothings.org/gamedev/l_systems.html), can be transformed into an equivalent but more familiar form.

The demo above is the result of implementing this form of the algorithm with some of the 'global goals' and 'local goals' suggested by Parish and Müller. Support for pathfinding between two locations on the road network has also been added.

### Algorithm

The post mentioned above do a good job of explaining the structure of the algorithm. Reading the pseudo-code:

```
initialize priority queue Q with a single entry: r(0, r0, q0)
initialize segment list S to empty

until Q is empty
  pop smallest r(ti, ri, qi) from Q
  accepted = localConstraints(&r)
  if (accepted) {
    add segment(ri) to S
    foreach r(tj, rj, qj) produced by globalGoals(ri, qi)
      add r(ti + 1 + tj, rj, qj) to Q
  }
```

`r` is a road segment with parameters: `ti` - the time delay until the segment is placed in the world, `ri` - the geometrical properties of the segment, and `qi` - any additional metadata associated with the segment. `Q` is a list of segments yet to be placed in the world. In each iteration of the algorithm the segment with the smallest `ti` is removed from `Q`. `localConstraints` checks the segment for compatibility with all previously placed segments and may modify its geometry if necessary, for example to join the end of the segment to a nearby junction.

If the segment is found to be compatible, it is added to the list of placed segments `S`. The newly placed segment is then fed into `globalGoals` which decides what, if any, new segments should branch out from it in the future. The implementation of globalGoals is entirely up to the developer: I made the decision for roads to simply tend towards areas of high population density. The original authors added further constraints to create several distinctive categories of road patterns.

The behaviour of the algorithm can be visualised by turning on the debug view in the demonstration above. The highlighted path shows the order that segments are placed. Segments can be seen branching out from the main highways, and merging with parallel areas of growth as dictated by the local constraints. The consequence of queueing the segments by `ti` can also be seen, causing the network to grow roughly uniformly across its circumference and leaving no dangling segment inactive for long.

Coloured points on the debug view correspond to local constraints proposed by Parish and Müller (2001):

1. if "two streets intersect" then "generate a crossing".
2. if "ends close to an existing crossing" then "extend street, to reach the crossing".
3. if "close to intersecting" then "extend street to form intersection".

### Population Density

Three layers of simplex noise were combined to define the population density map. The resulting map has two purposes. One is to guide the forward extension of existing road segments; if a random deviation will reach a higher population than extending the original segment straight ahead, the extension will match that deviation. The second purpose of the population map is to determine when normal road segments should branch off from a highway - when the population along the highway meets a defined threshold.

### Building Placement

In the example above the [separating axis theorem](http://www.metanetsoftware.com/technique/tutorialA.html#section2) is used for collision detection, specifically to disperse buildings among the road network. The initial position of each building is randomly selected. To determine the final position of a building it is moved away from any overlapping roads or existing buildings along the axis of minimum overlap. If the building is still not in the clear after a fixed number of iterations, it is discarded.

### Pathfinding

The A\* algorithm is used for pathfinding. During the generation process, each road segment is associated with those segments which connect directly to either end of it, allowing the network of segments to be traversed.

The movement cost of each segment is the time to travel along it: a function of its length and the maximum allowed speed. Playing around with the pathfinding in the demonstration above, you may notice that the highway segments, which have a higher maximum speed, are preferred over normal road segments. The speed is in turn a function of the capacity of the road i.e. the traffic currently using the road, and although all roads are currently defined as empty, the pathfinder has the ability to avoid busier roads.