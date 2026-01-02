'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface MealNameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (mealName: string) => void
  defaultName?: string
}

export function MealNameDialog({ open, onOpenChange, onConfirm, defaultName = '' }: MealNameDialogProps) {
  const [mealName, setMealName] = useState(defaultName)

  const handleConfirm = () => {
    if (mealName.trim()) {
      onConfirm(mealName.trim())
      onOpenChange(false)
      setMealName('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Name Your Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="mealName">Give your meal a name</Label>
            <Input
              id="mealName"
              placeholder="e.g., My Favorite Bowl, Spicy Lunch, etc."
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && mealName.trim()) {
                  handleConfirm()
                }
              }}
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-2">
              This helps you identify and reorder your favorite meals later.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!mealName.trim()}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

