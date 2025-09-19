import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CharacterCreation } from './CharacterCreation'

describe('CharacterCreation', () => {
  const mockOnCharacterCreated = vi.fn()

  beforeEach(() => {
    mockOnCharacterCreated.mockClear()
  })

  describe('Name Entry Step', () => {
    it('should render name input form', () => {
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      expect(screen.getByText('Welcome to Habit Alchemy')).toBeInTheDocument()
      expect(screen.getByLabelText('Choose your hero name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Enter your hero\'s name...')).toBeInTheDocument()
    })

    it('should validate empty name', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      const continueButton = screen.getByRole('button', { name: /continue/i })
      await user.click(continueButton)
      
      expect(screen.getByText('Hero name is required')).toBeInTheDocument()
    })

    it('should validate short name', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      const nameInput = screen.getByLabelText('Choose your hero name')
      await user.type(nameInput, 'A')
      
      const continueButton = screen.getByRole('button', { name: /continue/i })
      await user.click(continueButton)
      
      expect(screen.getByText('Hero name must be at least 2 characters')).toBeInTheDocument()
    })

    it('should truncate long names to 20 characters', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      const nameInput = screen.getByLabelText('Choose your hero name') as HTMLInputElement
      await user.type(nameInput, 'A'.repeat(25))
      
      // Input should be truncated to 20 characters
      expect(nameInput.value).toBe('A'.repeat(20))
      expect(nameInput.value.length).toBe(20)
    })

    it('should proceed to class selection with valid name', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      const nameInput = screen.getByLabelText('Choose your hero name')
      await user.type(nameInput, 'Test Hero')
      
      const continueButton = screen.getByRole('button', { name: /continue/i })
      await user.click(continueButton)
      
      expect(screen.getByText('Choose Your Path')).toBeInTheDocument()
    })
  })

  describe('Class Selection Step', () => {
    it('should render all character classes', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      // Navigate to class selection
      const nameInput = screen.getByLabelText('Choose your hero name')
      await user.type(nameInput, 'Test Hero')
      await user.click(screen.getByRole('button', { name: /continue/i }))
      
      expect(screen.getByText('The Warrior')).toBeInTheDocument()
      expect(screen.getByText('The Scholar')).toBeInTheDocument()
      expect(screen.getByText('The Artist')).toBeInTheDocument()
      expect(screen.getByText('The Explorer')).toBeInTheDocument()
      expect(screen.getByText('The Sage')).toBeInTheDocument()
    })

    it('should allow class selection', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      // Navigate to class selection
      const nameInput = screen.getByLabelText('Choose your hero name')
      await user.type(nameInput, 'Test Hero')
      await user.click(screen.getByRole('button', { name: /continue/i }))
      
      // Find and click the warrior class card
      const warriorCard = screen.getByText('The Warrior').closest('[role="button"], .cursor-pointer') || 
                         screen.getByText('The Warrior').closest('div')
      expect(warriorCard).toBeInTheDocument()
      
      if (warriorCard) {
        await user.click(warriorCard)
        // Continue button should now be enabled
        const continueButton = screen.getByRole('button', { name: /continue/i })
        expect(continueButton).not.toBeDisabled()
      }
    })

    it('should validate class selection before proceeding', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      // Navigate to class selection
      const nameInput = screen.getByLabelText('Choose your hero name')
      await user.type(nameInput, 'Test Hero')
      await user.click(screen.getByRole('button', { name: /continue/i }))
      
      // Continue button should be disabled without class selection
      const continueButton = screen.getByRole('button', { name: /continue/i })
      expect(continueButton).toBeDisabled()
      
      // Try to click it anyway
      await user.click(continueButton)
      
      // Should still be on class selection screen
      expect(screen.getByText('Choose Your Path')).toBeInTheDocument()
    })
  })

  describe('Character Confirmation', () => {
    it('should show character preview and create character', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      // Navigate through all steps
      const nameInput = screen.getByLabelText('Choose your hero name')
      await user.type(nameInput, 'Test Hero')
      await user.click(screen.getByRole('button', { name: /continue/i }))
      
      // Select warrior class
      const warriorCard = screen.getByText('The Warrior').closest('div')
      if (warriorCard) {
        await user.click(warriorCard)
      }
      await user.click(screen.getByRole('button', { name: /continue/i }))
      
      // Should show confirmation screen
      expect(screen.getByText('Your Hero Awaits')).toBeInTheDocument()
      expect(screen.getByText('Test Hero')).toBeInTheDocument()
      expect(screen.getByText(/Level 1 warrior/i)).toBeInTheDocument()
      
      // Create character
      const beginButton = screen.getByRole('button', { name: /begin adventure/i })
      await user.click(beginButton)
      
      await waitFor(() => {
        expect(mockOnCharacterCreated).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Hero',
            class: 'warrior',
            level: 1
          })
        )
      })
    })
  })

  describe('Navigation', () => {
    it('should allow going back from class selection to name', async () => {
      const user = userEvent.setup()
      render(<CharacterCreation onCharacterCreated={mockOnCharacterCreated} />)
      
      // Navigate to class selection
      const nameInput = screen.getByLabelText('Choose your hero name')
      await user.type(nameInput, 'Test Hero')
      await user.click(screen.getByRole('button', { name: /continue/i }))
      
      // Go back
      const backButton = screen.getByRole('button', { name: /back/i })
      await user.click(backButton)
      
      expect(screen.getByText('Welcome to Habit Alchemy')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Hero')).toBeInTheDocument()
    })
  })
})