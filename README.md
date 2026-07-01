# A Matheuristic Augmented $\varepsilon$-constraint Framework for a Bi-objective Multi-Depot Cumulative Capacitated Vehicle Routing Problem

> Eduardo Segredo, Samuel Nucamendi, Eduardo Lalla-Ruiz, Gara Miranda
>
> European Journal of Operational Research
>
> DOI: (10.1016/j.ejor.2026.06.022)[https://doi.org/10.1016/j.ejor.2026.06.022]

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
depot_m_load
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
├── augmecon-ii           # Source code of AUGMECON-II
├── math-augmecon-ii      # Source code of Math-AUGMECON-II
├── nsga-ii               # Source code of NSGA-II
```

### Implemented methods

This repository includes implementations of:

| Method             | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `AUGMECON-II`      | Exact method based on AUGMECON-II                        |
| `Math-AUGMECON-II` | Proposed math-heuristic based on NSGA-II and AUGMECON-II |
| `NSGA-II`          | Memetic algorithm based on NSGA-II                       |

---

### Dependencies

To run the code, the following dependencies are required:

* AUGMECON-II: A Mathematical Programming Language (AMPL) and Gurobi.
* Math-AUGMECON-II: A Mathematical Programming Language (AMPL) and Gurobi.
* NSGA-II: Node.js and Node Package Manager (`npm`).

#### Installing dependencies

In the case of NSGA-II, the following steps have to be performed on the directory `source-code/nsga-ii` of the repository:

1. `npm i`
2. `npm run build`

---

### Execution

#### AUGMECON-II and Math-AUGMECON-II

For AUGMECON-II:

NOTE: You have to be placed in the folder C:\..\AUGMECON-II\

If you want to run AUGMECON-II with the original fleet size for lr instances
1. `include LLRPBO_OF.run`

If you want to run AUGMECON-II with the reduced fleet size for lr instances
1. `include LLRPBO_RF.run`

If you want to run AUGMECON-II with the reduced fleet size for p instances
1. `include LLRPBO_p.run`

For Math-AUGMECON-II:

Considering the Original Fleet Size

NOTE: You have to be placed in the folder C:\..\Math-AUGMECON-II\

If you want to run AUGMECON-II with the original fleet size for lr instances
1. `include LLRPBO_lr.run`

Considering the Reduced Fleet Size

NOTE: You have to be placed in the folder C:\..\Math-AUGMECON-II_RF\

If you want to run AUGMECON-II with the original fleet size for lr instances
1. `include LLRPBO_lr.run`

If you want to run AUGMECON-II with the original fleet size for p instances
1. `include LLRPBO_p.run`

#### NSGA-II

To run NSGA-II (from directory `source-code/nsga-ii` of the repository):

```bash
node lib/implementation/main.js nsga
```

The main available parameters of NSGA-II are available through the execution of the following command:

```bash
node lib/implementation/main.js nsga --help
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

Each result file contains the following information:

```text
Numfront:
<N>

<Algorithm_Name>: <Number_of_Solutions>
<Objective 1> <Objective 2>
<Objective 1> <Objective 2>
...

<Algorithm_Name>: <Number_of_Solutions>
<Objective 1> <Objective 2>
...
```

Examples
---

Header

The first section specifies the size of the reference Pareto front:

```text
Numfront:
61
```

where:

- Numfront = number of solutions in the reference Pareto front.

---

Algorithm Blocks

Each algorithm block contains:

```text
Algorithm_Name: Number_of_Solutions
```

followed by the objective vectors of the nondominated solutions found by that algorithm.

Example:

```text
AUGMECON2:	9
545.69071	412.43668
580.30118	407.15804
583.62475	403.80217
585.20545	401.95141
586.92475	397.23363
588.70621	393.09150
592.26912	384.87295
661.49005	379.59431
724.30561	376.39069
```

This indicates that AUGMECON-II found nine nondominated solutions.

---

Objective Values

Each row represents one Pareto solution:

```text
545.69071	412.43668
```

where:

|    Column   |      Description                     |
|-------------|--------------------------------------|
| Objective 1 | First objective value (latency)      |
| Objective 2 | Second objective value (travel cost) |

The specific meaning of each objective depends on the optimization model.

---

Algorithms

AUGMECON-II

Reference Pareto front generated using the exact AUGMECON-II method.

Example:

```text
AUGMECON-II: 9
```

---

NSGA-II_k

Results from the *k-th independent run* of NSGA-II.

Example:

```text
NSGA-II_12: 3
```

means:

- Algorithm: NSGA-II
- Run: 12
- Solutions found: 9

---

Math-AUGMECON-II_k

Results from the *k-th independent run* of Math-AUGMECON-II.

Example:

```text
Math-AUGMECON-II_7: 9
```

means:

- Algorithm: Math-AUGMECON-II
- Run: 7
- Solutions found: 9

---

Example

```text
Numfront:
61

NSGA-II_1:	9
545.69071	412.43668
580.30118	407.15804
583.62475	403.80217
585.20545	401.95141
586.92475	397.23363
588.70621	393.09150
592.26912	384.87295
661.49005	379.59431
724.30561	376.39069
```

Interpretation:

- The reference Pareto front contains 61 solutions.
- Run 1 of NSGA-II found 9 nondominated solutions.
- The corresponding objective vectors are:
  - (545.69071, 412.43668)
  - (580.30118,	407.15804)
  - (583.62475,	403.80217)
  - (585.20545,	401.95141)
  - (586.92475,	397.23363)
  - (588.70621,	393.09150)
  - (592.26912,	384.87295)
  - (661.49005,	379.59431)
  - (724.30561,	376.39069)

---

Notes

- The Pareto front reported for each run of Math-AUGMECON-II considers the corresponding NSGA-II Pareto front as input.
- For instance, the front reported in Math-AUGMECON-II_1 considers the Pareto front achieved in the run NSGA-II_1 as input.

---

Example file:

```text
lr_01.txt
```

where:

- `lr` identifies the problem instance category.
- `01` identifies the specific test instance.

---

## Citation

If you use this repository, the instances, the source code, or the experimental results in your research, please cite the associated article:

```bibtex
@article{segredo:2026a,
  title   = {A Matheuristic Augmented $\varepsilon$-constraint Framework for a Bi-objective Multi-Depot Cumulative Capacitated Vehicle Routing Problem},
  author  = {Eduardo Segredo, Samuel Nucamendi, Eduardo Lalla-Ruiz, Gara Miranda},
  journal = {European Journal of Operational Research},
  year    = {2026},
  doi     = {Accepted for publication}
}
```

You may also cite this repository directly:

```bibtex
@misc{segredo:2026b,
  title        = {A Matheuristic Augmented $\varepsilon$-constraint Framework for a Bi-objective Multi-Depot Cumulative Capacitated Vehicle Routing Problem},
  author       = {Eduardo Segredo, Samuel Nucamendi, Eduardo Lalla-Ruiz, Gara Miranda},
  year         = {2026},
  howpublished = {\url{https://github.com/PAL-ULL/Math-AUGMECON-II-EJOR}},
  note         = {Repository associated with the article A Matheuristic Augmented $\varepsilon$-constraint Framework for a Bi-objective Multi-Depot Cumulative Capacitated Vehicle Routing Problem} published in the European Journal of Operational Research}
}
```

## Acknowledgements

Samuel Nucamendi-Guillén thanks Universidad Panamericana for partially funding this project under the grant UP-CI-2024-GDL-08-ING.

This work is also partially supported by Project PID2023‐152614OB‐I00 funded by MICIU/AEI/10.13039/501100011033 and by "ERDF/EU".

We would like to express our sincere gratitude for the invaluable assistance provided during part of this work by Cristo Daniel Navarro Rodríguez and Professor Casiano Rodríguez León.

---

## Contact

For questions, suggestions, or issues related to this repository, please contact:

> **Eduardo Segredo**
> 
> Universidad de La Laguna
> 
> esegredo@ull.edu.es
