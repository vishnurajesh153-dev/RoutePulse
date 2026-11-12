import React from 'react';
import { ArrowRight, MoreHorizontal } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { members } from '../../data/members';

export default function MembersPanel({ showAll, setShowAll }) {
  const visible = members.slice(0, showAll ? 4 : 3);

  return (
    <div className="panel members-panel">
      <div className="panel-heading">
        <div>
          <div className="section-kicker">THE CREW</div>
          <h2>Group members <span className="count-badge">4</span></h2>
        </div>
        <button className="dots-button" onClick={() => setShowAll(!showAll)}>
          <MoreHorizontal size={19} />
        </button>
      </div>

      <div className="member-list">
        {visible.map((m, i) => (
          <div className="member-row" key={m.name}>
            <Avatar person={m} />
            <div className="member-info">
              <strong>{m.name}</strong>
              <small>{m.role}</small>
            </div>
            <div className="member-metrics">
              <strong>{m.speed} <small>km/h</small></strong>
              <span className={i === 3 ? 'catching' : 'online'}>
                {i === 3 ? 'Catching up' : '● On route'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="text-button full-width" onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show less' : 'View all members'} <ArrowRight size={14} />
      </button>
    </div>
  );
}
