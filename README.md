# SimilCode Frontend

**React 18.2 web interface for the SimilCode source-code similarity analysis system.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React 18.2](https://img.shields.io/badge/react-18.2-61DAFB.svg)](https://react.dev/)
[![Node.js 18+](https://img.shields.io/badge/node.js-18+-339933.svg)](https://nodejs.org/)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.21265977.svg)](https://doi.org/10.5281/zenodo.21265977)

---

## Overview

**SimilCode Frontend** is the web interface of **SimilCode**, a source-code similarity analysis system developed as part of a controlled within-subjects study benchmarking four contemporary commercial large language models (LLMs) as similarity analysts:

- Claude Opus 4.1 (Anthropic)
- GPT-5 (OpenAI)
- Gemini 2.5 Pro (Google)
- DeepSeek-V3 (DeepSeek)

The frontend provides the instructor-facing workflow for submitting code pairs, selecting the analysis model, and consuming multidimensional similarity scores together with human-readable justifications and Big O complexity estimates returned by the backend API.

The system is designed as a **screening aid** for academic-integrity workflows in resource-constrained higher-education institutions, and is explicitly not intended as an evidentiary instrument for adjudicating academic misconduct.

Supported source languages in this release: **C#** and **Java**.

## Related repository

The Django/Python REST API consumed by this frontend is available separately:  
[https://github.com/gleiston-guerrero/BackEnd-SimilCode](https://github.com/gleiston-guerrero/BackEnd-SimilCode)

## Technical stack

| Component | Version |
|---|---|
| React | 18.2 |
| Node.js | 18+ |
| npm | 9+ |
| Bundler | Vite |

## Key components

- **Code-pair submission form** — dual-editor interface with syntax highlighting for C# and Java, and language auto-detection based on file extension.
- **Model selector** — allows the instructor to route the request to any of the four supported LLMs, or to compare all four in a single session.
- **Results view** — multidimensional similarity scores, textual justifications, and Big O complexity estimates rendered together, with export to PDF for institutional records.
- **Session dashboard** — history of past analyses tied to the authenticated user, with search and filtering.
- **Authentication** — token-based, consuming the backend API's session endpoints.

## Quick start

### Prerequisites

- Node.js 18 or newer, and npm 9 or newer
- A running instance of the SimilCode Backend (see [BackEnd-SimilCode](https://github.com/gleiston-guerrero/BackEnd-SimilCode)) reachable from the frontend

### Installation

```bash
git clone https://github.com/gleiston-guerrero/FrontEnd-SimilCode.git
cd FrontEnd-SimilCode
cp .env.example .env
# edit .env: set VITE_API_BASE_URL to the URL of your BackEnd-SimilCode instance
npm install
npm run dev
```

The development server will be available at `http://localhost:5173/`.

### Production build

```bash
npm run build
npm run preview  # optional: local preview of the production bundle
```

The optimised static bundle is emitted to `dist/`, ready to be served by any static-file host or reverse proxy (Nginx, Apache, Caddy, or a container behind the backend).

## Repository structure

```
FrontEnd-SimilCode/
├── LICENSE                  # MIT
├── README.md                # this file
├── CITATION.cff             # machine-readable citation metadata
├── package.json             # dependencies and npm scripts
├── package-lock.json        # locked dependency graph
├── vite.config.js           # bundler configuration
├── .env.example             # environment-variable template
├── index.html               # Vite entry point
├── public/                  # static assets served as-is
└── src/
    ├── main.jsx             # React entry point
    ├── App.jsx              # top-level component
    ├── components/          # reusable UI components
    ├── pages/               # route-level views
    ├── services/            # API clients (talk to BackEnd-SimilCode)
    └── styles/              # global CSS
```

## How to cite

If you use SimilCode in your research, please cite both the software and the accompanying paper:

**Software:**
> Guerrero-Ulloa, G. C., Navas Rivera, R. A., Díaz-Macías, E., Hornos, M. J., & Rodríguez-Domínguez, C. (2026). *SimilCode Frontend* (Version 1.0.0) [Computer software]. Zenodo. https://doi.org/10.5281/zenodo.21265977

**Paper:**
> Guerrero-Ulloa, G. C., Navas Rivera, R. A., Díaz-Macías, E., Hornos, M. J., & Rodríguez-Domínguez, C. (2026). SimilCode: A Web Application for Source Code Similarity Detection and Algorithmic Efficiency Analysis using Generative Artificial Intelligence. *International Journal for Educational Integrity* (under review).

A machine-readable `CITATION.cff` file is provided in this repository; GitHub renders a "Cite this repository" button in the sidebar, and Zenodo reads it automatically when minting the DOI.

## Authors and affiliations

| Author | Affiliation | CRediT roles |
|---|---|---|
| **Gleiston Cicerón Guerrero-Ulloa** | Facultad de Ciencias de la Computación, Universidad Técnica Estatal de Quevedo (UTEQ), Ecuador | Conceptualization; Data Curation; Formal Analysis; Methodology; Project Administration; Supervision; Validation; Visualization; Writing – Original Draft; Writing – Review & Editing |
| **Rafael Alexander Navas Rivera** | Facultad de Ciencias de la Computación, Universidad Técnica Estatal de Quevedo (UTEQ), Ecuador | Conceptualization; Data Curation; Formal Analysis; Methodology; Project Administration; Resources; Software; Visualization; Writing – Original Draft; Writing – Review & Editing |
| **Efraín Díaz-Macías** | Facultad de Ciencias de la Computación, Universidad Técnica Estatal de Quevedo (UTEQ), Ecuador | Formal Analysis; Methodology; Project Administration; Resources; Supervision; Validation; Writing – Review & Editing |
| **Miguel J. Hornos** | Department of Software Engineering, University of Granada (UGR), Spain | Formal Analysis; Funding Acquisition; Methodology; Project Administration; Resources; Supervision; Validation; Visualization; Writing – Review & Editing |
| **Carlos Rodríguez-Domínguez** ⭐ | Department of Software Engineering, and Research Center for Information and Communication Technologies (CITIC), University of Granada (UGR), Spain | Formal Analysis; Funding Acquisition; Methodology; Project Administration; Resources; Supervision; Validation; Visualization; Writing – Review & Editing |

⭐ **Corresponding author:** Carlos Rodríguez-Domínguez — <carlosrodriguez@ugr.es>

## Privacy and ethical considerations

Deploying SimilCode routes source code through commercial third-party LLM providers. Institutions adopting the system should establish a formal data-processor relationship consistent with applicable regulations (EU GDPR, Ecuador's *Ley Orgánica de Protección de Datos Personales* — LOPDP, Registro Oficial Suplemento 459, 2021, and equivalent frameworks in other jurisdictions). See Section 5.3 of the accompanying paper for a full discussion.

## Contributing

This repository is the code-of-record for the accompanying peer-reviewed publication. Issues and pull requests are welcome; please open an issue before submitting substantial changes.

## License

MIT License — see [`LICENSE`](LICENSE) for the full text.

## Acknowledgements

The authors thank the five expert instructors of the Faculty of Computer Sciences at the Universidad Técnica Estatal de Quevedo who participated in the validation phase, and acknowledge the institutional support of UTEQ.
