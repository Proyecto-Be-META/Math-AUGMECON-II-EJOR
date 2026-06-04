# A Matheuristic Augmented $\varepsilon$-constraint Framework for a Bi-objective Multi-Depot Cumulative Capacitated Vehicle Routing Problem

> Eduardo Segredo, Samuel Nucamendi, Eduardo Lalla-Ruiz, Gara Miranda
>
> European Journal of Operational Research
>
> DOI: Accepted for publication

This repository contains the instances, source code, execution scripts, and experimental results used in the evaluation presented in the article. Its purpose is to support reproducibility and enable comparison with future work.

---

## Repository contents

The repository is organized as follows:

```text
.
├── instances/          # Instances used in the experimental evaluation
├── results/            # Experimental results
├── source-code/        # Source code of the implemented methods/algorithms
├── LICENSE             # Repository license
└── README.md           # This file
```

---

## Overview

This repository provides the materials used to experimentally evaluate NSGA-II and Math-AUGMECON-II.

In particular, it includes:

* Benchmark instances used in the experimental study.
* Source code required to run the evaluated algorithms or procedures.
* Experimental results reported in or derived from the article.
* Additional information to interpret, compare, or extend the results.

---

## Instances

The instances used in the experiments are located in:

```text
instances/
```

Each instance represents a network of customers and depots. It includes the number of customers, the number of vehicles and the vehicles capacity. The location of each client/depot is described as well. Finally, the customers demands and the depots loads are also included. A load equal to zero for a particular depot means an unlimited load.

The instances are organized as follows:

```text
instances/
├── cordeau/
├── lr/
```

Each group corresponds to the Lalla-Ruiz (`lr`) and Cordeau instance sets.

### Instance format

Each instance file follows the format below:

```text
Number of customers (n)
Number of depots (m)
Vehicles capacity

customer_1_coordinates
customer_2_coordinates
...
customer_n_coordinates
depot_1_coordinates
depot_2_coordinates
...
depot_m_coordinates

customer_1_demand
customer_2_demand
...
customer_n_demand
depot_1_load
depot_2_load
...
depot_n_load
```

Example:

```text
10
4
60

140.000000 30.000000
0.000000 60.000000
10.000000 0.000000
-100.000000 100.000000
-110.000000 90.000000
40.000000 40.000000
0.000000 0.000000
-90.000000 0.000000
-60.000000 110.000000
-70.000000 0.000000
40.000000 110.000000
-110.000000 80.000000
-140.000000 140.000000
-10.000000 -10.000000

1.000000
1.000000
2.000000
2.000000
1.000000
1.000000
2.000000
1.000000
8.000000
2.000000
0.000000
0.000000
0.000000
0.000000
```

---

## Source code

The source code is located in:

```text
source-code/
```

The main components are:

```text
source-code/
├── math-augmecon-ii      # Main entry point
├── nsga-ii               # Implementation of the main method
```

### Implemented methods

This repository includes implementations of:

| Method             | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `NSGA-II`          | Memetic algorithm based on NSGA-II                       |
| `AUGMECON-II`      | Exact method based on AUGMECON-II                        |
| `Math-AUGMECON-II` | Proposed math-heuristic based on NSGA-II and AUGMECON-II |

---

## Requirements

To run the code, the following dependencies are required:

* NSGA-II: Node.js and Node Package Manager (`npm`).
* AUGMECON-II:
* Math-AUGMECON-II:

### Installing dependencies

In the case of NSGA-II, the following steps have to be performed on the directory `source-code/nsga-ii` of the repository:

1. `npm i`
2. `npm run build`

---

## Execution

To run NSGA-II (from `source-code/nsga-ii`):

```bash
node lib/implementation/main.js nsga
```

The main available parameters of NSGA-II are available through the execution of:

```bash
node lib/implementation/main.js nsga --help                                                                                             ✔  at 13:11:25  
main.js nsga

Runs the NSGA-II

Options:
      --help                     Shows help                           [boolean]
      --version                  Shows version                        [boolean]
  -f, --instanceFile             Input file name with the instance to be solved
                                                            [string] [required]
  -r, --fleetSize                Number of vehicles         [number] [required]
      --stoppingCriterion, --sc  Stopping criterion considered
      [string] [enum: "Gen", "Time", "Eval"] [default: "Gen"]
  -g, --generations              Max number of generations to be run
                                                          [number] [default: 10]
  -t, --time                     Max number of seconds to be run
                                                          [number] [default: 60]
  -e, --evaluations              Max number of evaluations to be performed
                                                          [number] [default: 1000]
  -p, --populationSize           Population size          [number] [default: 10]
      --crossover, --co          Crossover operator
          [string] [enum: "OnePoint", "OrderRoute"] [default: "OrderRoute"]
      --crossoverRate, --cr      Crossover rate            [number] [default: 1]
      --constructiveInit, --ci   Initialise population with a constructive
                                 approach            [boolean] [default: false]
      --localSearch, --ls        Local search to be applied
              [string] [enum: "NoLS", "LS"] [default: "NoLS"]
```

An example of execution of NSGA-II over a particular instance would be:

```bash
node lib/implementation/main.js nsga -f ../../instances/lr/10x4-1.txt -r 2 --sc Time -t 60 -p 100 --co OrderRoute --cr 1 --ci true --ls LS
```

---

## Experimental results

The experimental results are located in:

```text
results/
```

Recommended structure:

```text
results/
├── cordeau-instances/  # Results achieved by different methods for Cordeau instance set
├── lr-instances/       # Results achieved by different methods for Lalla-Ruiz instance set
```

### Result format

Each result file contains information such as:

---

## Citation

If you use this repository, the instances, the source code, or the experimental results in your research, please cite the associated article:

```bibtex
@article{[key],
  title   = {[Article Title]},
  author  = {[Authors]},
  journal = {[Journal or conference]},
  year    = {[Year]},
  doi     = {[DOI]}
}
```

You may also cite this repository directly:

```bibtex
@misc{[repository_key],
  title        = {[Repository Title]},
  author       = {[Authors]},
  year         = {[Year]},
  howpublished = {\url{[Repository URL]}},
  note         = {Repository associated with the article [Article Title]}
}
```

---

## Contact

For questions, suggestions, or issues related to this repository, please contact:

**Eduardo Segredo**
Universidad de La Laguna
esegredo@ull.edu.es
