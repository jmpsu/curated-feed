# Curated Stream — Complete User Requirements

## Product outcome

Create a user-specific daily media feed that continuously presents relevant short-form posts, videos, images, and articles as an autonomous slideshow. The product is reached from a new **Stream** link on Joeysvault.app and is maintained in `jmpsu/curated-feed`.

## Non-negotiable requirements

1. A full-screen mixed-media presentation area automatically advances after a content-type-aware duration; current content recedes into the timeline and the queued item enlarges into focus.
2. A visual horizontal timeline gives every item a poster or thumbnail and clearly distinguishes current, previous, and upcoming items.
3. The stream accepts article, image, Instagram, X/Twitter, YouTube, video, and RSS-derived objects through one normalized content model.
4. An always-visible RSS/headline sidebar links to original sources and follows the current subject and tag filters.
5. Every content object displays machine-assigned tags. A user can add a suggested tag or remove an incorrect tag in one click.
6. An always-visible tag search lets a user drag or tap tags into a focus zone. The stream refreshes to content matching those tags.
7. Settings support tag weights, tag intersections such as `#ai` + `#cuttingedge`, more/only/none modes, source settings, and session-only or permanent exclusions.
8. Likes, saves, skips, dwell time, tag edits, exclusions, and source visits improve future ranking while preserving direct user control.
9. Initial preference knowledge is derived from the user's Instagram saved-post collections and personal pictures, retaining collection membership as high-value labels.
10. Imported objects preserve original URLs, media metadata, poster images, transcripts or extracted text when permitted, user collection labels, generated descriptions, embeddings, provenance, and fetch time.
11. Background ingestion continuously discovers and ranks new material from approved feeds and APIs, deduplicates it, and refreshes the playlist.
12. The tool must be user-specific, authenticated, responsive, accessible, versioned, observable, and resilient to missing media, API limits, and deleted sources.
13. No social-account password is stored. Account access uses supported authorization or a user-controlled export/import route.
14. Research, source comparison, architectural decisions, limitations, implementation status, and verification evidence remain documented.

## Evidence used

- Meta: “The Instagram Platform is a collection of APIs that allows your app to access data for Instagram professional accounts including both businesses and creators.”
- Meta media reference: “This API returns only data for media owned by Instagram professional accounts. It can not be used to get data for media owned by personal Instagram accounts.”
- Cloudflare AI Search: new instances “come with built-in storage and a vector index, so you can upload a file, have it indexed immediately, and search it right away.”
- Swiper: “mobile touch slider with hardware accelerated transitions” with React support.
- News Aggregator: “Self-hosted, AI-enhanced RSS/Atom news aggregator” with OPML import/export, categorization, full-text search, alerts, and digests.

## Recommended production architecture

### Ingestion

- Import Instagram archive/export data and user-supplied media first; retain collection names as supervised labels. Do not scrape with a stored password.
- Use API adapters for YouTube and other supported services, RSS/Atom polling for publications, and user-approved URL submission.
- Enqueue every item for normalization, metadata extraction, poster generation, transcript/text extraction, tagging, embedding, and deduplication.

### Storage and retrieval

- Store normalized records and user preferences in a relational database.
- Store permitted media derivatives and posters in object storage.
- Store semantic vectors plus filterable metadata in vector search.
- Preserve source provenance and keep embeddings as a retrieval index, not as the canonical record.

### Ranking

- Candidate generation combines exact tags, tag intersections, recent feeds, semantic similarity to liked/saved objects, source diversity, and exploration.
- Ranking combines explicit tag weight, similarity, recency, source affinity, quality, novelty, and negative-feedback penalties.
- Hard exclusions and “only” rules execute before scoring. Session preferences stay client-scoped; saved preferences persist per user.
- Every recommendation exposes matched tags and source provenance.

### Presentation and operations

- A normalized renderer selects a safe card/player per content type; unsupported embeds fall back to a poster, excerpt, and source link.
- Playback duration derives from media length or readable word count and supports keyboard, touch, reduced motion, and manual navigation.
- OAuth tokens and API secrets stay server-side; scheduled workers fetch incrementally with rate limits, retries, and dead-letter handling.
- Observability records adapter health, latency, deduplication, ranking outcomes, and feedback without logging secrets.

## Reusable material compared

| Material | Reusable value | Decision |
| --- | --- | --- |
| `jmpsu/curated-feed` | Canonical project destination | Empty at review time; establish the codebase here. |
| Swiper | Touch, keyboard, transitions | Optional for later virtualization; native React/CSS is sufficient now. |
| FreshRSS / Miniflux pattern | Mature feed ingestion and OPML concepts | Reuse adapter/API concepts, not an entire reader UI. |
| AI-enhanced News Aggregator | Categorization, search, alerts, OPML | Reference its pipeline boundaries; omit its unrelated application shell. |
| Cloudflare storage, scheduled Workers, and vector search | Persistence, jobs, assets, semantic retrieval | Recommended production infrastructure. |
| Attached carousel reference | Center focus, neighboring cards, timeline motion | Adapted into a cinematic stage with explicit thumbnail timeline. |
| `hosts-master.zip` | Domain blocklist aggregation | Not applicable; excluded. |

## Verified delivery boundary

The first deployed release is a functional interaction prototype: carousel timing, navigation, focus-tag filtering, drag/drop, tag removal, weighting controls, exclusions, likes, saves, and responsive layout work against a curated seed set. Live Instagram import, platform ingestion, durable per-user persistence, scheduled discovery, and the Joeysvault.app navigation change require authorization and access to the separate homepage deployment; none are represented as connected before verification.
