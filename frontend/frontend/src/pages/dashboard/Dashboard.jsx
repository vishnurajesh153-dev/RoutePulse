import React, { useState } from 'react';
import { ArrowUpRight, HeartPulse, Navigation, MapPin, Plus, Timer } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import StatsGrid from '../../components/dashboard/StatsGrid';
import MembersPanel from '../../components/dashboard/MembersPanel';
import WeatherCard from '../../components/dashboard/WeatherCard';
import RoutePanel from '../../components/dashboard/RoutePanel';
import InsightPanel from '../../components/dashboard/InsightPanel';
import PacerStrip from '../../components/dashboard/PacerStrip';
import MapCanvas from '../../components/map/MapCanvas';
import PlannerModal from '../../components/ui/PlannerModal';
import Toast from '../../components/ui/Toast';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export default function Dashboard() {
  const { user }     = useAuth();
  const { notice, notify } = useToast();

  const [activeNav,      setActiveNav]      = useState('Overview');
  const [selectedRoute,  setSelectedRoute]  = useState(0);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [showPlanner,    setShowPlanner]    = useState(false);

  const firstName = user?.name?.split(' ')[0] || 'Rider';

  const handleNavChange = (label) => {
    setActiveNav(label);
    if (label === 'Plan a route') {
      setShowPlanner(true);
    }
  };

  const handlePlanSubmit = (destination) => {
    notify(`Route planning request prepared for ${destination || 'your destination'}. Connect the PACER API to calculate real routes.`);
  };

  return (
    <>
      <AppShell
        activeNav={activeNav}
        setActiveNav={handleNavChange}
        pageTitle="Overview"
        onNotify={notify}
      >
        {/* Welcome row */}
        <section className="welcome-row">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> YOUR GROUP, IN SYNC
            </div>
            <h1>Good afternoon, {firstName} <span className="wave">✳</span></h1>
            <p className="subheading">Ready to make your next move? Here's your group at a glance.</p>
          </div>
          <button className="primary-button" onClick={() => setShowPlanner(true)}>
            <Plus size={17} /> Plan a new route
          </button>
        </section>

        {/* KPI stats */}
        <StatsGrid />

        {/* Map + right column */}
        <section className="content-grid">
          {/* Map panel */}
          <div className="panel map-panel">
            <div className="panel-heading map-heading">
              <div>
                <div className="section-kicker">YOUR NEXT ADVENTURE</div>
                <h2>Route overview <span className="live-pill"><i />READY</span></h2>
              </div>
              <button className="subtle-button" onClick={() => notify('Full-screen map view coming soon.')}>
                Explore map <ArrowUpRight size={15} />
              </button>
            </div>
            <MapCanvas />
            <div className="map-summary">
              <div className="summary-item">
                <span className="summary-icon"><Navigation size={15} /></span>
                <div><small>STARTING FROM</small><strong>Central Park Gate</strong></div>
              </div>
              <div className="summary-item">
                <span className="summary-icon"><MapPin size={15} /></span>
                <div><small>DESTINATION</small><strong>Riverside Park</strong></div>
              </div>
              <div className="summary-item">
                <span className="summary-icon"><Timer size={15} /></span>
                <div><small>ESTIMATED TIME</small><strong>54 minutes</strong></div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="right-column">
            <MembersPanel showAll={showAllMembers} setShowAll={setShowAllMembers} />
            <WeatherCard />
          </div>
        </section>

        {/* Routes + insights */}
        <section className="bottom-grid">
          <RoutePanel
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            onNotify={notify}
          />
          <InsightPanel selectedRoute={selectedRoute} />
        </section>

        {/* PACER strip */}
        <PacerStrip onNotify={notify} />

        {/* Footer */}
        <footer className="footer">
          <span>© 2026 RoutePulse. Move together, arrive safer.</span>
          <span>Designed for every pace <HeartPulse size={13} /></span>
        </footer>
      </AppShell>

      {/* Planner modal */}
      {showPlanner && (
        <PlannerModal
          onClose={() => setShowPlanner(false)}
          onSubmit={handlePlanSubmit}
        />
      )}

      {/* Toast */}
      <Toast message={notice} />
    </>
  );
}
