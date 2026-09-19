import { FC } from 'react';

interface HoneypotFieldProps {
  value: string;
  onChange: (val: string) => void;
}

/**
 * Campo armadilha (honeypot) invisível para humanos mas preenchido por scrapers automatizados
 */
export const HoneypotField: FC<HoneypotFieldProps> = ({ value, onChange }) => {
  return (
    <div
      aria-hidden="true"
      style={{
        opacity: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        height: 0,
        width: 0,
        zIndex: -1,
        pointerEvents: 'none'
      }}
    >
      <label htmlFor="website_hp_verification">Deixe este campo em branco</label>
      <input
        id="website_hp_verification"
        type="text"
        name="website_hp_verification"
        value={value}
        tabIndex={-1}
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
