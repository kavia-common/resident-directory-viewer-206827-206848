import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/**
 * Local resident dataset (frontend-only).
 * Keep fields simple but realistic to support filtering and details view.
 */
const RESIDENTS = [
  {
    id: "r-1001",
    name: "Avery Johnson",
    unit: "12B",
    age: 34,
    status: "Active",
    phone: "(555) 010-1203",
    email: "avery.johnson@example.com",
    moveInDate: "2021-04-19",
    notes: "Prefers email contact. Enjoys community gardening.",
    tags: ["Garden", "Email"],
  },
  {
    id: "r-1002",
    name: "Mina Patel",
    unit: "4A",
    age: 29,
    status: "Active",
    phone: "(555) 010-4421",
    email: "mina.patel@example.com",
    moveInDate: "2023-01-08",
    notes: "Works nights; best contact window is afternoons.",
    tags: ["Quiet Hours"],
  },
  {
    id: "r-1003",
    name: "Jordan Lee",
    unit: "9C",
    age: 41,
    status: "Active",
    phone: "(555) 010-9092",
    email: "jordan.lee@example.com",
    moveInDate: "2019-09-01",
    notes: "Has a registered pet. Likes SMS reminders.",
    tags: ["Pet", "SMS"],
  },
  {
    id: "r-1004",
    name: "Sofia Ramirez",
    unit: "2D",
    age: 37,
    status: "Inactive",
    phone: "(555) 010-2230",
    email: "sofia.ramirez@example.com",
    moveInDate: "2017-05-12",
    notes: "Moved out recently; forward mail until end of month.",
    tags: ["Forward Mail"],
  },
  {
    id: "r-1005",
    name: "Elliot Chen",
    unit: "15A",
    age: 26,
    status: "Active",
    phone: "(555) 010-7711",
    email: "elliot.chen@example.com",
    moveInDate: "2024-06-03",
    notes: "New resident; requested building orientation packet.",
    tags: ["New"],
  },
  {
    id: "r-1006",
    name: "Harper Davis",
    unit: "7B",
    age: 52,
    status: "Active",
    phone: "(555) 010-0038",
    email: "harper.davis@example.com",
    moveInDate: "2016-11-22",
    notes: "Primary contact via phone. Participates in board meetings.",
    tags: ["Board"],
  },
];

const STATUS_OPTIONS = ["All", "Active", "Inactive"];

/**
 * PUBLIC_INTERFACE
 * App renders the Resident Directory Viewer UI (frontend-only):
 * - Local dataset
 * - Header and search bar
 * - Filterable resident list
 * - Details view (right-side panel on desktop, modal on mobile)
 * - Retro theme + basic accessibility
 */
function App() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedResidentId, setSelectedResidentId] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSmallLayout, setIsSmallLayout] = useState(false);

  const searchInputRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Determine layout mode (modal on small screens; panel on larger screens).
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const update = () => setIsSmallLayout(Boolean(mq.matches));
    update();

    // MediaQueryList has different APIs across browsers; handle both.
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const selectedResident = useMemo(() => {
    return RESIDENTS.find((r) => r.id === selectedResidentId) || null;
  }, [selectedResidentId]);

  const filteredResidents = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESIDENTS.filter((r) => {
      const matchesQuery =
        q.length === 0 ||
        r.name.toLowerCase().includes(q) ||
        r.unit.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ? true : r.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const counts = useMemo(() => {
    const total = RESIDENTS.length;
    const shown = filteredResidents.length;
    const active = RESIDENTS.filter((r) => r.status === "Active").length;
    const inactive = RESIDENTS.filter((r) => r.status === "Inactive").length;
    return { total, shown, active, inactive };
  }, [filteredResidents.length]);

  function openResident(residentId) {
    setSelectedResidentId(residentId);
    setIsDetailsOpen(true);
  }

  function closeDetails() {
    setIsDetailsOpen(false);
  }

  // Focus management for details modal/panel.
  useEffect(() => {
    if (isDetailsOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (!isDetailsOpen && searchInputRef.current) {
      // Return focus to search for better keyboard UX.
      searchInputRef.current.focus();
    }
  }, [isDetailsOpen]);

  // Escape closes modal/panel.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && isDetailsOpen) {
        e.preventDefault();
        closeDetails();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDetailsOpen]);

  const showDetails = Boolean(isDetailsOpen && selectedResident);

  return (
    <div className="App">
      <a className="skipLink" href="#main">
        Skip to main content
      </a>

      <header className="rdHeader" role="banner">
        <div className="rdHeader__inner">
          <div className="rdBrand" aria-label="Resident Directory Viewer">
            <div className="rdBrand__badge" aria-hidden="true">
              RD
            </div>
            <div className="rdBrand__text">
              <div className="rdBrand__title">Resident Directory</div>
              <div className="rdBrand__subtitle">
                Retro Viewer • Frontend-only
              </div>
            </div>
          </div>

          <div className="rdStats" aria-label="Resident counts">
            <div className="rdChip" title="Total residents">
              Total: <strong>{counts.total}</strong>
            </div>
            <div className="rdChip" title="Active residents">
              Active: <strong>{counts.active}</strong>
            </div>
            <div className="rdChip" title="Inactive residents">
              Inactive: <strong>{counts.inactive}</strong>
            </div>
          </div>
        </div>

        <div className="rdToolbar" role="search" aria-label="Search residents">
          <label className="srOnly" htmlFor="resident-search">
            Search residents by name, unit, or email
          </label>
          <input
            id="resident-search"
            ref={searchInputRef}
            className="rdSearch"
            type="search"
            value={query}
            placeholder="Search by name, unit, or email…"
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />

          <label className="srOnly" htmlFor="status-filter">
            Filter residents by status
          </label>
          <select
            id="status-filter"
            className="rdSelect"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>

          <button
            className="rdBtn"
            type="button"
            onClick={() => {
              setQuery("");
              setStatusFilter("All");
              setSelectedResidentId(null);
              setIsDetailsOpen(false);
              if (searchInputRef.current) searchInputRef.current.focus();
            }}
          >
            Reset
          </button>
        </div>

        <div className="rdResultLine" aria-live="polite">
          Showing <strong>{counts.shown}</strong> of <strong>{counts.total}</strong>{" "}
          residents
        </div>
      </header>

      <main id="main" className="rdMain" role="main">
        <section className="rdListPane" aria-label="Resident list">
          <div className="rdListHeader">
            <h2 className="rdH2">Residents</h2>
            <div className="rdHint" id="resident-list-hint">
              Tip: Press <kbd>Esc</kbd> to close details.
            </div>
          </div>

          <ul
            className="rdList"
            aria-describedby="resident-list-hint"
            aria-label="Search results"
          >
            {filteredResidents.length === 0 ? (
              <li className="rdEmpty" role="status">
                No residents match your search.
              </li>
            ) : (
              filteredResidents.map((r) => {
                const isSelected = r.id === selectedResidentId;
                return (
                  <li key={r.id} className="rdListItem">
                    <button
                      type="button"
                      className={`rdRow ${isSelected ? "isSelected" : ""}`}
                      onClick={() => openResident(r.id)}
                      aria-label={`View details for ${r.name}`}
                      aria-current={isSelected ? "true" : undefined}
                    >
                      <div className="rdRow__main">
                        <div className="rdRow__name">{r.name}</div>
                        <div className="rdRow__meta">
                          <span className="rdPill" title="Unit">
                            Unit {r.unit}
                          </span>
                          <span
                            className={`rdPill ${
                              r.status === "Active" ? "isOk" : "isMuted"
                            }`}
                            title="Status"
                          >
                            {r.status}
                          </span>
                          <span className="rdPill isInfo" title="Move-in date">
                            Move-in {r.moveInDate}
                          </span>
                        </div>
                      </div>
                      <div className="rdRow__chev" aria-hidden="true">
                        ▸
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </section>

        {/* Desktop: right-side panel. Mobile: modal overlay. */}
        {showDetails && (
          <>
            {isSmallLayout ? (
              <div
                className="rdModalOverlay"
                role="dialog"
                aria-modal="true"
                aria-label={`Resident details for ${selectedResident.name}`}
                onMouseDown={(e) => {
                  // Click outside closes.
                  if (e.target === e.currentTarget) closeDetails();
                }}
              >
                <div className="rdModal">
                  <ResidentDetails
                    resident={selectedResident}
                    onClose={closeDetails}
                    closeButtonRef={closeButtonRef}
                  />
                </div>
              </div>
            ) : (
              <aside className="rdDetailsPane" aria-label="Resident details panel">
                <ResidentDetails
                  resident={selectedResident}
                  onClose={closeDetails}
                  closeButtonRef={closeButtonRef}
                />
              </aside>
            )}
          </>
        )}

        {!showDetails && (
          <aside className="rdDetailsPane rdDetailsPane--empty" aria-label="Details">
            <div className="rdDetailsEmpty" role="status">
              <div className="rdDetailsEmpty__title">Select a resident</div>
              <div className="rdDetailsEmpty__text">
                Choose a resident from the list to view full details here.
              </div>
            </div>
          </aside>
        )}
      </main>

      <footer className="rdFooter" role="contentinfo">
        <span>
          Built with React • Local dataset • Retro UI
        </span>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * ResidentDetails renders a resident detail view and a close action.
 * Used in a side panel (desktop) or modal (mobile).
 */
function ResidentDetails({ resident, onClose, closeButtonRef }) {
  return (
    <div className="rdDetails">
      <div className="rdDetails__top">
        <div className="rdDetails__titleBlock">
          <h2 className="rdH2 rdH2--details">{resident.name}</h2>
          <div className="rdDetails__sub">
            Unit <strong>{resident.unit}</strong> • {resident.status} • Age{" "}
            <strong>{resident.age}</strong>
          </div>
        </div>

        <button
          type="button"
          className="rdBtn rdBtn--ghost"
          onClick={onClose}
          ref={closeButtonRef}
          aria-label="Close resident details"
        >
          Close
        </button>
      </div>

      <div className="rdDetails__grid" role="group" aria-label="Resident info">
        <InfoRow label="Phone" value={resident.phone} />
        <InfoRow label="Email" value={resident.email} />
        <InfoRow label="Move-in" value={resident.moveInDate} />
        <InfoRow label="Status" value={resident.status} />
      </div>

      <div className="rdDetails__section">
        <h3 className="rdH3">Notes</h3>
        <p className="rdPara">{resident.notes || "No notes available."}</p>
      </div>

      <div className="rdDetails__section">
        <h3 className="rdH3">Tags</h3>
        <div className="rdTagRow" aria-label="Resident tags">
          {(resident.tags || []).length === 0 ? (
            <span className="rdMuted">No tags</span>
          ) : (
            resident.tags.map((t) => (
              <span key={t} className="rdTag">
                {t}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="rdInfoRow">
      <div className="rdInfoRow__label">{label}</div>
      <div className="rdInfoRow__value">{value}</div>
    </div>
  );
}

export default App;
