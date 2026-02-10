# Admin Panel Design Document (Cricbuzz‑like Sports Platform)

## 1. Purpose & Scope

This document defines the **end‑to‑end flow, architecture, and functional requirements** for an **Admin Panel** capable of controlling and operating an entire sports platform similar to **Cricbuzz**. The admin panel is intended for **internal users only** and supports operational, editorial, technical, and business functions.

The scope includes:

* User & role management
* Match, tournament, and live scoring control
* Content and editorial workflows
* System configuration and platform governance
* Monetization, ads, and analytics
* Security, audit, and compliance

---

## 2. User Roles & Access Control (RBAC)

### 2.1 Admin User Types

| Role                   | Description         | Example Permissions        |
| ---------------------- | ------------------- | -------------------------- |
| Super Admin            | Full system access  | All modules, role creation |
| Operations Admin       | Match & live ops    | Match control, scoring     |
| Content Admin          | Editorial control   | News, commentary, media    |
| Analyst                | Read‑only analytics | Reports, dashboards        |
| Ads/Admin Monetization | Revenue ops         | Ads, sponsorships          |
| Support Admin          | User support        | User moderation, tickets   |
| Tech Admin             | Platform configs    | Feature flags, APIs        |

### 2.2 Permission Model

* Role‑based access control (RBAC)
* Granular permissions at **module + action** level
* Example:

  * `MATCH.CREATE`
  * `MATCH.EDIT`
  * `SCORE.UPDATE`
  * `USER.SUSPEND`

---

## 3. High‑Level System Architecture

### 3.1 Logical Components

* Admin Web Application (React/Angular/Vue)
* Backend APIs (Microservices)
* Realtime Engine (WebSocket / Kafka)
* Database Layer (SQL + NoSQL)
* Cache (Redis)
* Media Storage (CDN)
* Monitoring & Logging

### 3.2 Admin Panel Core Modules

1. Authentication & Security
2. Dashboard & Analytics
3. Match & Tournament Management
4. Live Scoring Engine Control
5. Teams, Players & Officials
6. Content Management System (CMS)
7. Media & Assets
8. User Management & Moderation
9. Ads & Monetization
10. Notifications & Alerts
11. System Configuration
12. Audit Logs & Compliance

---

## 4. Authentication & Security Flow

### 4.1 Login Flow

1. Admin enters credentials
2. MFA / OTP validation
3. Role & permission resolution
4. Session token issued (JWT)
5. Access granted to allowed modules

### 4.2 Security Controls

* MFA mandatory for privileged roles
* IP whitelisting (optional)
* Session timeout & refresh tokens
* Device fingerprinting
* Brute‑force protection

---

## 5. Admin Dashboard

### 5.1 Purpose

Single‑view operational overview of the platform.

### 5.2 Dashboard Widgets

* Live matches count
* Matches with issues (scoring delays)
* Traffic (users online)
* Revenue snapshot
* Content publishing queue
* System health indicators

### 5.3 Customization

* Role‑based dashboards
* Drag & drop widgets
* Time‑range filters

---

## 6. Tournament & Match Management

### 6.1 Tournament Module

* Create/Edit/Delete tournaments
* Tournament types:

  * League
  * Knockout
  * Series
* Assign teams, venues, schedules
* Tournament status lifecycle

  * Draft → Published → Live → Completed → Archived

### 6.2 Match Management

**Match Creation**

* Teams
* Venue
* Officials
* Match type (ODI, T20, Test)
* Start time (timezone aware)

**Match Controls**

* Start / Pause / Resume / Abandon
* Delay reason tagging
* Override status manually

---

## 7. Live Scoring & Commentary Control

### 7.1 Scoring Engine

* Ball‑by‑ball scoring input
* Undo / correction workflow
* Overwrite with admin approval

### 7.2 Commentary Management

* Text commentary
* Rich events (Wicket, Six, Review)
* Auto + manual commentary merge

### 7.3 Data Validation

* Rule engine for cricket laws
* Conflict detection (score mismatch)
* Audit trail for every update

---

## 8. Teams, Players & Officials

### 8.1 Player Management

* Player profiles
* Career statistics
* Team associations
* Injury & availability flags

### 8.2 Team Management

* Squad selection per match
* Captain/Wicketkeeper assignment

### 8.3 Officials

* Umpires, referees
* Match assignment history

---

## 9. Content Management System (CMS)

### 9.1 Content Types

* News articles
* Match previews & reports
* Player stories
* Editorial blogs

### 9.2 Workflow

Draft → Review → Approve → Publish → Archive

### 9.3 Controls

* SEO metadata
* Geo‑targeting
* Scheduled publishing
* Content versioning

---

## 10. Media & Asset Management

* Image upload (player, team, news)
* Video highlights
* CDN integration
* Image cropping & optimization
* Rights & usage metadata

---

## 11. User Management & Moderation

### 11.1 End‑User Controls

* Search users
* Suspend / Ban
* Shadow ban (comments hidden)

### 11.2 Community Moderation

* Comment moderation
* Abuse & spam detection
* User reports handling

---

## 12. Ads & Monetization

### 12.1 Ad Inventory

* Banner
* Interstitial
* Video
* Sponsored content

### 12.2 Campaign Management

* Create campaigns
* Targeting (geo, device, match)
* Priority & frequency capping

### 12.3 Revenue Tracking

* Impressions
* CTR
* Revenue by match/tournament

---

## 13. Notifications & Alerts

### 13.1 Admin Alerts

* Scoring delays
* System downtime
* Data inconsistency

### 13.2 User Notifications (Controlled via Admin)

* Match start alerts
* Wicket alerts
* Breaking news

---

## 14. System Configuration

### 14.1 Feature Flags

* Enable/disable modules
* A/B experiments

### 14.2 Platform Settings

* Time zones
* Language support
* Match rules variations

---

## 15. Analytics & Reporting

### 15.1 Operational Analytics

* Match latency
* Scoring accuracy

### 15.2 Business Analytics

* DAU/MAU
* Retention
* Revenue

### 15.3 Reports

* Export (CSV, PDF)
* Scheduled reports

---

## 16. Audit Logs & Compliance

* Every admin action logged
* Immutable logs
* Searchable by:

  * User
  * Module
  * Time

Compliance support:

* GDPR data deletion
* Data retention policies

---

## 17. Error Handling & Fail‑Safe Controls

* Match rollback
* Scoring freeze
* Manual override approvals
* Disaster recovery mode

---

## 18. Non‑Functional Requirements

* High availability (99.9%+)
* Low‑latency live updates (<1s)
* Horizontal scalability
* Strong consistency for scoring

---

## 19. Future Enhancements (Optional)

* AI‑assisted commentary
* Predictive analytics
* Automated anomaly detection
* Multi‑sport extensibility

---

## 20. Summary

This admin panel acts as the **command center** of the entire platform, enabling operational control, editorial excellence, data integrity, and revenue optimization while maintaining security and compliance.

---

# 21. Advanced Live Match Management – Full Implementation Blueprint

This section defines a **production-grade, Cricbuzz-level live match admin system**, focusing on **real-time accuracy, fault tolerance, operational workflows, and human-in-the-loop controls**.

---

## 21.1 Live Match Control Room (Core Screen)

This is the most critical admin screen.

### A. Real-Time Panels

| Panel              | Function                         |
| ------------------ | -------------------------------- |
| Match State Panel  | Live status, innings, over, ball |
| Score Engine Panel | Runs, wickets, extras            |
| Event Stream       | Ball-by-ball timeline            |
| Commentary Editor  | Text + tags                      |
| Alerts Panel       | Errors, conflicts                |
| Admin Actions      | Pause, lock, rollback            |

### B. Match State Machine

```
SCHEDULED
 → TOSS_DONE
 → INNINGS_1_LIVE
 → INNINGS_BREAK
 → INNINGS_2_LIVE
 → SUPER_OVER (optional)
 → RESULT_DECLARED
 → ARCHIVED
```

State transitions are **strictly validated**.

---

## 21.2 Scoring Engine – Deep Design

### A. Ball Lifecycle

1. Ball initiated
2. Input received (run, wicket, extra)
3. Rule validation
4. State mutation
5. Event broadcast
6. Persistent commit

### B. Supported Ball Types

* Legal delivery
* No-ball (bat / non-bat)
* Wide
* Bye / Leg-bye
* Penalty runs
* Dead ball

### C. Wicket Types

* Bowled
* Caught
* LBW
* Run out
* Stumped
* Retired hurt
* Timed out

Each wicket requires **mandatory metadata**.

---

## 21.3 Undo, Correction & Dispute Handling

### A. Undo Rules

| Action           | Allowed          |
| ---------------- | ---------------- |
| Last ball undo   | Yes              |
| Over rollback    | Yes (admin only) |
| Innings rollback | Restricted       |

### B. Correction Flow

1. Correction request created
2. Impact preview shown
3. Super Admin approval
4. System replays events
5. Audit log updated

---

## 21.4 Multi-Admin Concurrency Control

### A. Locking Model

* Match-level lock
* Innings-level lock
* Scoring-only lock

### B. Conflict Prevention

* Optimistic locking
* Versioned events
* Last-write protection

---

## 21.5 Realtime Infrastructure

### A. Event Bus

* Kafka / Pulsar
* Event types:

  * BALL_ADDED
  * SCORE_UPDATED
  * MATCH_STATE_CHANGED

### B. WebSocket Fanout

* Separate channels per match
* Delta-based updates

---

## 21.6 Fail-Safe & Disaster Recovery

### A. Offline Mode

* Local queue for scorers
* Auto-sync on reconnect

### B. Scoring Freeze

* Triggered on inconsistency
* Read-only for public
* Admin-only correction

### C. Backup Scorer

* Dual scoring input
* Auto-compare streams

---

## 21.7 Commentary System (Advanced)

### A. Commentary Types

* Manual text
* Template-based auto
* AI-assisted (optional)

### B. Commentary Metadata

* Sentiment
* Event tags
* Player references

---

## 21.8 Match Rules Engine

### A. Rule Sets

* ICC standard
* League-specific overrides
* Custom conditions

### B. Special Scenarios

* DLS recalculation
* Super overs
* Reserve days
* Bad light / rain

---

## 21.9 Performance & Accuracy SLAs

| Metric                | Target   |
| --------------------- | -------- |
| Ball publish latency  | < 500 ms |
| Score accuracy        | 99.99%   |
| Admin action response | < 200 ms |

---

## 21.10 Admin UX Principles (Critical)

* Keyboard-first scoring
* Minimal clicks per ball
* Color-coded validation
* One-screen live ops

---

## 21.11 Database Design (Live Match)

### Core Tables

* matches
* innings
* overs
* balls (immutable)
* score_snapshots
* corrections

Event sourcing preferred.

---

## 21.12 Audit & Compliance (Live Ops)

* Every ball immutable
* Corrections as new events
* Who/when/why mandatory

---

## 21.13 Production Deployment Model

* Separate live-scoring cluster
* Hot standby region
* Read replicas for public traffic

---

## 21.14 Operational Roles (Match Day)

| Role             | Responsibility |
| ---------------- | -------------- |
| Primary Scorer   | Ball input     |
| Backup Scorer    | Parallel input |
| Match Supervisor | Validation     |
| Tech Ops         | Infra          |

---

## 21.15 Why Cricbuzz-Level Accuracy Is Hard

* Human error tolerance
* Network instability
* Legal edge cases
* Concurrency at scale

This design explicitly addresses all four.

---

## 22. Final Note

This is not just an admin panel—it is a **real-time distributed system with editorial and operational control layers**. Building it requires strict discipline around event sourcing, validation, and admin UX.
