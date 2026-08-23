"""
Deterministic conditional-language detection.

Scans text for financially significant conditional phrases and annotates
``LoanFact`` objects whose status the LLM may have incorrectly set to
EXPLICIT when the source text contains conditional language.

No LLM calls — pure Python string analysis.
"""

import re
from typing import List, Dict, Any, Optional

from app.core.loan_categories import LoanFact, EvidenceStatus


# ---------------------------------------------------------------------------
# Conditional phrase catalogue
# ---------------------------------------------------------------------------

CONDITIONAL_PHRASES: List[str] = [
    "if",
    "when",
    "after",
    "before",
    "within",
    "only",
    "subject to",
    "provided that",
    "only if",
    "unless otherwise",
    "waived after",
    "waived if",
    "applicable when",
    "in the event of",
    "upon default",
    "prior written notice",
    "written notice",
    "written request",
    "not exceeding",
    "lock-in of",
    "lock in of",
    "lock-in period",
    "lock in period",
    "plus applicable",
    "plus applicable taxes",
    "plus gst",
    "inclusive of gst",
    "exclusive of gst",
    "statutory levies",
    "statutory charges",
    "stamp duty",
    "interest tax",
    "other levies",
    "after 12 emis",
    "after twelve emis",
    "twice in a financial year",
    "365 days",
    "actual days elapsed",
    "daily basis",
    "calculated daily",
    "monthly rests",
    "cooling-off",
    "look-up",
    "3 days",
    "without penalty",
    "no penalty",
    "own sources",
    "increase emi",
    "increase tenor",
    "prepay",
    "immediate repayment",
    "immediately payable",
    "subject to rbi",
    "as per regulatory",
    "contingent upon",
    "depending on",
    "minimum of",
    "maximum of",
    "at least",
]

# Pre-compile a single regex that matches any of the phrases as whole words
_PHRASE_PATTERN = re.compile(
    r"\b(" + "|".join(re.escape(p) for p in sorted(CONDITIONAL_PHRASES, key=len, reverse=True)) + r")\b",
    re.IGNORECASE,
)

_TAX_PATTERN = re.compile(r"\b(gst|applicable\s+tax(?:es)?|statutory\s+(?:levies|charges)|stamp\s+duty|interest\s+tax)\b", re.IGNORECASE)
_TIMING_PATTERN = re.compile(r"\b(after\s+\d+\s+emis?|within\s+\d+\s+days?|\d+\s+days?\s+prior\s+written\s+notice|lock[- ]in|cooling[- ]off|look[- ]up|due\s+date|from\s+date\s+of\s+default)\b", re.IGNORECASE)
_CALC_PATTERN = re.compile(r"\b(365\s*days|actual\s+days\s+elapsed|daily\s+basis|calculated\s+daily|monthly\s+rests|reducing\s+balance|equated\s+monthly\s+instal[l]?ment|epi)\b", re.IGNORECASE)
_NOTICE_PATTERN = re.compile(r"\b(written\s+notice|written\s+request|notification|intimated|advance\s+notice)\b", re.IGNORECASE)
_EXCEPTION_PATTERN = re.compile(r"\b(without\s+penalty|no\s+penalty|increase\s+emi|increase\s+tenor|prepay|own\s+sources|waiver)\b", re.IGNORECASE)


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def detect_conditions(text: str) -> List[Dict[str, Any]]:
    """
    Scan *text* for conditional phrases.
    """
    if not text:
        return []

    results: List[Dict[str, Any]] = []
    for match in _PHRASE_PATTERN.finditer(text):
        start = max(0, match.start() - 30)
        end = min(len(text), match.end() + 30)
        results.append({
            "phrase": match.group(0).lower(),
            "context": text[start:end].strip(),
            "position": match.start(),
        })
    return results


def extract_categorized_conditions(text: str) -> Dict[str, List[str]]:
    """
    Extract structured taxonomy of contractual qualifiers from text:
    - tax: GST, statutory levies, stamp duty
    - timing: lock-ins, notice durations, cooling-off windows
    - notice: written request / notification prerequisites
    - calculation: 365-day, actual days, daily basis, monthly rests, EPI
    - exceptions: penalty waivers, own sources, EMI/tenor adjustment options
    """
    if not text:
        return {}

    categories: Dict[str, List[str]] = {}

    taxes = list(set(_TAX_PATTERN.findall(text)))
    if taxes:
        categories["tax_and_statutory"] = taxes

    timing = list(set(_TIMING_PATTERN.findall(text)))
    if timing:
        categories["timing_and_lockin"] = timing

    notices = list(set(_NOTICE_PATTERN.findall(text)))
    if notices:
        categories["notice_and_request"] = notices

    calcs = list(set(_CALC_PATTERN.findall(text)))
    if calcs:
        categories["calculation_basis"] = calcs

    exceptions = list(set(_EXCEPTION_PATTERN.findall(text)))
    if exceptions:
        categories["exceptions_and_options"] = exceptions

    return categories


def format_condition_summary(text: str) -> str:
    """Format extracted qualifiers as an explicit directive callout for LLM context."""
    cats = extract_categorized_conditions(text)
    if not cats:
        return ""
    parts = []
    for cat_name, items in cats.items():
        label = cat_name.replace("_", " ").title()
        parts.append(f"{label}: {', '.join(items)}")
    return " [Contractual Qualifiers: " + " | ".join(parts) + "]"


def annotate_facts_with_conditions(
    facts: List[LoanFact],
    chunks: Optional[List[Dict[str, Any]]] = None,
) -> List[LoanFact]:
    """
    Deterministically check whether each fact's ``source_text`` contains
    conditional language. If it does and the fact's status is currently
    ``EXPLICIT``, upgrade it to ``CONDITIONAL``.
    """
    for fact in facts:
        text_to_check = fact.source_text or ""
        if fact.condition:
            text_to_check += " " + fact.condition

        conditions = detect_conditions(text_to_check)
        if conditions and fact.status == EvidenceStatus.EXPLICIT:
            fact.status = EvidenceStatus.CONDITIONAL
            if not fact.condition:
                fact.condition = conditions[0]["context"]

    return facts
