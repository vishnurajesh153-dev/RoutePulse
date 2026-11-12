import React from 'react';

export default function Avatar({ person, small = false }) {
  return (
    <div className={`avatar ${person.color} ${small ? 'small' : ''}`}>
      {person.initials}
    </div>
  );
}
