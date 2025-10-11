import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog'

describe('Dialog Components', () => {
  describe('Basic Dialog Structure', () => {
    it('renders dialog trigger and content', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger data-testid="dialog-trigger">
            Open Dialog
          </DialogTrigger>
          <DialogContent data-testid="dialog-content">
            <DialogHeader>
              <DialogTitle>Flight Information</DialogTitle>
              <DialogDescription>
                Details about the selected flight
              </DialogDescription>
            </DialogHeader>
            <div>Dialog body content</div>
            <DialogFooter>
              <button>Close</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      // Initially, dialog content should not be visible
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
      
      // Click trigger to open dialog
      const trigger = screen.getByTestId('dialog-trigger')
      expect(trigger).toBeInTheDocument()
      
      await user.click(trigger)
      
      // Now dialog content should be visible
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
      expect(screen.getByText('Flight Information')).toBeInTheDocument()
      expect(screen.getByText('Details about the selected flight')).toBeInTheDocument()
    })
  })

  describe('DialogTrigger', () => {
    it('renders trigger button with correct content', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Flight Details</DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>
      )
      
      expect(screen.getByText('Open Flight Details')).toBeInTheDocument()
    })

    it('can render as different element using asChild', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button data-testid="custom-trigger">Custom Button</button>
          </DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>
      )
      
      expect(screen.getByTestId('custom-trigger')).toBeInTheDocument()
      expect(screen.getByText('Custom Button')).toBeInTheDocument()
    })
  })

  describe('DialogContent', () => {
    it('applies correct classes to content', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent data-testid="dialog-content">
            Content
          </DialogContent>
        </Dialog>
      )
      
      await user.click(screen.getByText('Open'))
      
      const content = screen.getByTestId('dialog-content')
      expect(content).toHaveClass(
        'fixed',
        'left-[50%]',
        'top-[50%]',
        'z-50',
        'grid',
        'w-full',
        'max-w-lg',
        'translate-x-[-50%]',
        'translate-y-[-50%]',
        'gap-4',
        'border',
        'bg-background',
        'p-6',
        'shadow-lg'
      )
    })
  })

  describe('DialogHeader', () => {
    it('renders header with correct classes', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader data-testid="dialog-header">
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      
      await user.click(screen.getByText('Open'))
      
      const header = screen.getByTestId('dialog-header')
      expect(header).toHaveClass(
        'flex',
        'flex-col',
        'space-y-1.5',
        'text-center',
        'sm:text-left'
      )
    })
  })

  describe('DialogTitle', () => {
    it('renders title with correct content and classes', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Flight BA123 Details</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      
      await user.click(screen.getByText('Open'))
      
      const title = screen.getByText('Flight BA123 Details')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass(
        'text-lg',
        'font-semibold',
        'leading-none',
        'tracking-tight'
      )
    })
  })

  describe('DialogDescription', () => {
    it('renders description with correct content and classes', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogDescription>Flight status and departure information</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      
      await user.click(screen.getByText('Open'))
      
      const description = screen.getByText('Flight status and departure information')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-sm', 'text-muted-foreground')
    })
  })

  describe('DialogFooter', () => {
    it('renders footer with correct classes', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogFooter data-testid="dialog-footer">
              <button>Action</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      
      await user.click(screen.getByText('Open'))
      
      const footer = screen.getByTestId('dialog-footer')
      expect(footer).toHaveClass(
        'flex',
        'flex-col-reverse',
        'sm:flex-row',
        'sm:justify-end',
        'sm:space-x-2'
      )
    })
  })

  describe('Dialog Accessibility', () => {
    it('has proper ARIA attributes', async () => {
      const user = userEvent.setup()
      
      render(
        <Dialog>
          <DialogTrigger>Open Flight Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Flight Information</DialogTitle>
              <DialogDescription>Flight details and status</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      
      await user.click(screen.getByText('Open Flight Dialog'))
      
      // Check for dialog role
      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      
      // Check for proper labeling
      expect(dialog).toHaveAccessibleName('Flight Information')
      expect(dialog).toHaveAccessibleDescription('Flight details and status')
    })
  })
})