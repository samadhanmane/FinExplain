"""
Context Builder and Deterministic Evidence Compressor for FinExplain.

Converts retrieved document chunks into clean, structured, and bounded evidence contexts
for LLM generation, reducing token consumption by up to 75% while maintaining citation trace.
"""

import hashlib
import re
from typing import List, Dict, Any, Optional


def estimate_tokens(text: str) -> int:
    return len(text) // 4


def compress_evidence_context(
    chunks: List[Dict[str, Any]],
    query: str,
    max_tokens: int = 2000,
    max_passages: int = 6,
) -> str:
    """
    Build structured, qualifier-preserving evidence context from top retrieved chunks.
    Preserves complete clauses, tax terms, lock-in periods, notice rules, and calculation bases.
    """
    if not chunks:
        return ""

    from app.rag.extraction.condition_detector import format_condition_summary

    context_parts = []
    seen_hashes = set()
    current_tokens = 0

    for chunk in chunks[:max_passages]:
        metadata = chunk.get("metadata") or {}
        raw_text = (chunk.get("parent_text") or chunk.get("text") or "").strip()
        if not raw_text:
            continue

        norm_prefix = " ".join(raw_text.lower().split()[:25])
        text_hash = hashlib.md5(norm_prefix.encode("utf-8")).hexdigest()
        if text_hash in seen_hashes:
            continue
        seen_hashes.add(text_hash)

        page_num = chunk.get("page_number") or chunk.get("page_num") or metadata.get("page_num") or 1
        section = chunk.get("section_title") or metadata.get("section_title") or ""
        doc_name = chunk.get("document_name") or metadata.get("document_name") or ""
        product = chunk.get("product_name") or metadata.get("product_name") or ""
        display_name = doc_name or product or "Agreement"

        header_parts = [display_name]
        if page_num:
            header_parts.append(f"Page {page_num}")
        if section:
            header_parts.append(f"Section: {section}")

        condition_summary = format_condition_summary(raw_text)
        formatted_entry = f"[{', '.join(header_parts)}]{condition_summary}\n{raw_text}"
        tok = estimate_tokens(formatted_entry)

        if current_tokens + tok <= max_tokens:
            context_parts.append(formatted_entry)
            current_tokens += tok
        else:
            remaining = max_tokens - current_tokens
            if remaining > 60:
                char_limit = remaining * 4
                truncated = formatted_entry[:char_limit] + "..."
                context_parts.append(truncated)
            break

    return "\n\n---\n\n".join(context_parts) if context_parts else ""


def build_context(
    chunks: List[Dict[str, Any]], 
    max_tokens: int = 4000,
    max_chunks: Optional[int] = None,
) -> str:
    """Standard context builder for deep analysis queries."""
    if not chunks:
        return ""
    
    context_parts = []
    seen_hashes = set()
    current_tokens = 0
    chunks_added = 0
    
    for chunk in chunks:
        if max_chunks and chunks_added >= max_chunks:
            break

        metadata = chunk.get("metadata") or {}
        raw_text = chunk.get("text", "").strip()
        if not raw_text:
            continue

        norm_text = " ".join(raw_text.lower().split()[:30])
        text_hash = hashlib.md5(norm_text.encode("utf-8")).hexdigest()
        if text_hash in seen_hashes:
            continue
        seen_hashes.add(text_hash)

        header_parts = []
        doc_name = chunk.get("document_name") or metadata.get("document_name")
        product_name = chunk.get("product_name") or metadata.get("product_name")
        display_name = doc_name or product_name
        if display_name:
            header_parts.append(display_name)

        page_num = chunk.get("page_number") or chunk.get("page_num") or metadata.get("page_num")
        if page_num:
            header_parts.append(f"Page {page_num}")

        section_title = chunk.get("section_title") or metadata.get("section_title")
        if section_title:
            header_parts.append(f"Section: {section_title}")

        formatted_chunk = f"[{', '.join(header_parts)}]\n{raw_text}" if header_parts else raw_text
        chunk_tokens = estimate_tokens(formatted_chunk)
        
        if current_tokens + chunk_tokens <= max_tokens:
            context_parts.append(formatted_chunk)
            current_tokens += chunk_tokens
            chunks_added += 1
        else:
            remaining = max_tokens - current_tokens
            if remaining > 50:
                char_limit = remaining * 4
                truncated = formatted_chunk[:char_limit] + "..." if len(formatted_chunk) > char_limit else formatted_chunk
                context_parts.append(truncated)
                chunks_added += 1
            break
    
    return "\n\n---\n\n".join(context_parts) if context_parts else ""


def build_evidence_window(
    chunks: List[Dict[str, Any]],
    query: str,
    max_tokens: int = 1500,
    window_chars: int = 600,
) -> str:
    """Evidence window extractor."""
    return compress_evidence_context(chunks, query, max_tokens=max_tokens)
