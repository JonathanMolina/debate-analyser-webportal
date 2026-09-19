import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  it('deve renderizar o texto do badge corretamente com variante true', () => {
    render(<Badge variant="true">Verdadeiro</Badge>);
    expect(screen.getByText('Verdadeiro')).toBeInTheDocument();
  });

  it('deve renderizar o badge com variante false', () => {
    render(<Badge variant="false">Falso</Badge>);
    expect(screen.getByText('Falso')).toBeInTheDocument();
  });
});
