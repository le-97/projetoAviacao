import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from '../input'

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input data-testid="input" />)
    
    const input = screen.getByTestId('input')
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass(
      'flex',
      'h-9',
      'w-full',
      'rounded-md',
      'border',
      'border-input',
      'bg-transparent',
      'px-3',
      'py-1',
      'shadow-sm'
    )
    // Verify it has text sizing classes (text-base/text-sm with responsive)
    expect(input.className).toMatch(/text-(base|sm)/)
  })

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter flight number" />)
    
    const input = screen.getByPlaceholderText('Enter flight number')
    expect(input).toBeInTheDocument()
  })

  it('handles value changes', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    
    render(<Input onChange={handleChange} data-testid="input" />)
    
    const input = screen.getByTestId('input')
    await user.type(input, 'BA123')
    
    expect(handleChange).toHaveBeenCalled()
    expect(input).toHaveValue('BA123')
  })

  it('can be disabled', () => {
    render(<Input disabled data-testid="input" />)
    
    const input = screen.getByTestId('input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('supports different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="input" />)
    let input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'email')

    rerender(<Input type="password" data-testid="input" />)
    input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'password')

    rerender(<Input type="number" data-testid="input" />)
    input = screen.getByTestId('input')
    expect(input).toHaveAttribute('type', 'number')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input-class" data-testid="input" />)
    
    const input = screen.getByTestId('input')
    expect(input).toHaveClass('custom-input-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} data-testid="input" />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('supports controlled input', async () => {
    const user = userEvent.setup()
    let value = ''
    const handleChange = vi.fn((e) => {
      value = e.target.value
    })
    
    const { rerender } = render(
      <Input value={value} onChange={handleChange} data-testid="input" />
    )
    
    const input = screen.getByTestId('input')
    await user.type(input, 'Test')
    
    // Re-render with updated value
    rerender(<Input value="Test" onChange={handleChange} data-testid="input" />)
    
    expect(input).toHaveValue('Test')
  })

  it('supports various HTML input attributes', () => {
    render(
      <Input
        required
        minLength={3}
        maxLength={10}
        pattern="[A-Z]{2}[0-9]{3}"
        data-testid="input"
      />
    )
    
    const input = screen.getByTestId('input')
    expect(input).toHaveAttribute('required')
    expect(input).toHaveAttribute('minlength', '3')
    expect(input).toHaveAttribute('maxlength', '10')
    expect(input).toHaveAttribute('pattern', '[A-Z]{2}[0-9]{3}')
  })

  it('handles focus and blur events', async () => {
    const user = userEvent.setup()
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    
    render(
      <Input
        onFocus={handleFocus}
        onBlur={handleBlur}
        data-testid="input"
      />
    )
    
    const input = screen.getByTestId('input')
    
    await user.click(input)
    expect(handleFocus).toHaveBeenCalledTimes(1)
    
    await user.tab()
    expect(handleBlur).toHaveBeenCalledTimes(1)
  })
})