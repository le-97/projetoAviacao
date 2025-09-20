import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with correct classes', () => {
      render(
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      )
      
      const card = screen.getByTestId('card')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('rounded-xl', 'border', 'bg-card', 'text-card-foreground', 'shadow')
    })

    it('applies custom className', () => {
      render(
        <Card className="custom-card-class" data-testid="card">
          Content
        </Card>
      )
      
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-card-class')
    })
  })

  describe('CardHeader', () => {
    it('renders with correct classes', () => {
      render(
        <CardHeader data-testid="card-header">
          Header content
        </CardHeader>
      )
      
      const header = screen.getByTestId('card-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6')
    })
  })

  describe('CardTitle', () => {
    it('renders with correct classes and content', () => {
      render(<CardTitle>Flight Information</CardTitle>)
      
      const title = screen.getByText('Flight Information')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('leading-none', 'tracking-tight')
    })
  })

  describe('CardDescription', () => {
    it('renders with correct classes and content', () => {
      render(<CardDescription>Flight details and status</CardDescription>)
      
      const description = screen.getByText('Flight details and status')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('CardContent', () => {
    it('renders with correct classes', () => {
      render(
        <CardContent data-testid="card-content">
          <p>Main content</p>
        </CardContent>
      )
      
      const content = screen.getByTestId('card-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('p-6', 'pt-0')
    })
  })

  describe('CardFooter', () => {
    it('renders with correct classes', () => {
      render(
        <CardFooter data-testid="card-footer">
          <button>Action</button>
        </CardFooter>
      )
      
      const footer = screen.getByTestId('card-footer')
      expect(footer).toBeInTheDocument()
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0')
    })
  })

  describe('Complete Card Structure', () => {
    it('renders complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader data-testid="card-header">
            <CardTitle>Flight BA123</CardTitle>
            <CardDescription>London to New York</CardDescription>
          </CardHeader>
          <CardContent data-testid="card-content">
            <p>Departure: 14:30 GMT</p>
            <p>Arrival: 17:45 EST</p>
          </CardContent>
          <CardFooter data-testid="card-footer">
            <button>Track Flight</button>
          </CardFooter>
        </Card>
      )

      // Verify all components are rendered
      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByTestId('card-header')).toBeInTheDocument()
      expect(screen.getByTestId('card-content')).toBeInTheDocument()
      expect(screen.getByTestId('card-footer')).toBeInTheDocument()

      // Verify content
      expect(screen.getByText('Flight BA123')).toBeInTheDocument()
      expect(screen.getByText('London to New York')).toBeInTheDocument()
      expect(screen.getByText('Departure: 14:30 GMT')).toBeInTheDocument()
      expect(screen.getByText('Arrival: 17:45 EST')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /track flight/i })).toBeInTheDocument()
    })
  })
})