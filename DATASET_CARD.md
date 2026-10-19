# PRIYAN Engineering Notes — Starter v0.1

## What is actually included

54 unique synthetic concept records, six per group: COMMON, CSE, IT, ECE, EEE, MECH, AI, CSBS and CIVIL. Every concept contains an English explanation, a conversational Thanglish explanation, a worked example, a key formula or relation, a common misconception and one practice question with an answer. 108 derived instruction examples represent two language views of these same 54 concepts; they are **not** 108 additional concepts.

Formats: JSON (full structure), JSONL (full structure), CSV (a convenient subset), instruction-format JSONL, manifest with a JSONL SHA-256 checksum. All starter records are synthetic, unreviewed and train-only. No university, regulation, semester, unit or official course code is claimed. This is not a full four-year dataset and is not ready for high-stakes academic use without review.

## Provenance and permitted use

Starter notes were authored for this project with AI assistance. They do not contain copied textbook chapters or scraped student personal data. Starter text is offered under CC0-1.0. Imported materials retain the license/permission label supplied by the uploader; the starter license does not grant rights over imports. A permission checkbox records the uploader's declaration, not independent rights verification. Notes should be reviewed by a subject expert before publication or training.

## Quality and known limitations

Structural validation checks IDs, required fields, exact duplicate explanations, provenance and JSON/JSONL consistency. Worked examples have not received independent faculty review. Explanations simplify concepts; assumptions are stated in the text where practical. Thanglish spelling varies. The offline ranker tokenizes Unicode but has no Tamil semantic encoder or transliteration engine. It retrieves notes rather than solving new problems. A configured language model can generate explanations but may still make errors.

No diagrams, official examination rubrics, previous-year papers, OCR model or model weights are bundled. Scanned PDFs must undergo OCR separately. Quiz evaluation compares exact normalized text and is not mathematical equivalence checking. No evaluation accuracy or hallucination-rate claim is made.

## Extending toward a full curriculum

1. Obtain the official university/college regulation and all eight-semester curricula, including electives and labs. Review the applicable amendments. Start with one confirmed department.
2. Create one syllabus manifest entry per topic with exact university, regulation, department, semester, subject code, unit and topic. Fill `data/syllabus-template.json`; it is a placeholder, not official data.
3. Collect self-authored or licensed notes. Record source title, permission, page and curriculum metadata. Upload PDFs/TXT/Markdown in Dataset Studio or full records as JSON/JSONL.
4. Check extracted formulas, equations, tables and missing diagrams against the original. Imported records are drafts until a human confirms review in the UI.
5. Run `node scripts/coverage.mjs your-syllabus.json` to report exact mapped topics as reviewed, draft or missing. This tool does not guess topic equivalence.
6. Export reviewed material, deduplicate semantically, and create independently reviewed held-out questions before fine-tuning. Document-level grouped splits avoid placing chunks of one source document in multiple splits. Keep the same conceptual question family in one split as well; this requires review beyond the supplied source-title grouping.

Large counts are a result of genuine coverage. Duplicated wording and unreviewed synthetic expansions should not be counted as new knowledge.

## Source entry points for later collection

These are discovery links, not a claim that their contents are in this dataset or licensed for unrestricted redistribution:

- Anna University Centre for Academic Courses: https://cac.annauniv.edu/
- Anna University R2021 amendment index: https://cac.annauniv.edu/aidetails/ammend/ai_ug_ammen-R2021.html
- AICTE model curriculum PDF: https://aicte.gov.in/sites/default/files/ug-vol1.pdf

Check the specific program, institutional applicability, regulation, version and reuse permission before importing any external source.
